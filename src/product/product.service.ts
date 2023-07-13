import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4, v4 } from 'uuid';
import { Staff } from '../staff/models/staff.model';
import { Category } from '../category/models/category.model';
import { Image } from '../image/models/image.model';
import { roles } from '../constants/roles';
import { ImageService } from '../image/image.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Image) private imageRepository: typeof Image,
    @InjectModel(Category) private categoryRepository: typeof Category,
    @InjectModel(Staff) private staffRepository: typeof Staff,
    private readonly imageService: ImageService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    images: Express.Multer.File[],
    authHeader: string,
  ) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const categoryById = await this.getCategoryById(
      createProductDto.category_id,
    );
    if (!categoryById) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const staffById = await this.getStaffById(createProductDto.staff_id);
    if (!staffById) {
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
    }
    const newProduct = await this.productRepository.create({
      id: uuidv4(),
      ...createProductDto,
    });
    const fileNames = await this.imageService.createFile(images);
    for (let i of fileNames) {
      const newImage = await this.imageRepository.create({
        id: uuidv4(),
        file_name: i,
        product_id: newProduct.id,
      });
    }
    const productData = await this.productRepository.findOne({
      where: { id: newProduct.id },
      include: [Image],
      attributes: [
        'id',
        'name',
        'price',
        'description',
        'category_id',
        'staff_id',
        'createdAt',
      ],
    });
    const response = {
      status: 200,
      data: productData,
      success: true,
    };
    return response;
  }

  async findAll(page: number, authHeader: string) {
    page = Number(page);
    const staff = await this.verifyAccessToken(authHeader);
    const staffExist = await this.staffRepository.findOne({
      where: { id: staff.id },
    });
    if (!staffExist) {
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
    }
    const limit = 10;
    const offset = (page - 1) * limit;
    const allProducts = await this.productRepository.findAll({
      include: [Image, Category],
      attributes: [
        'id',
        'name',
        'price',
        'description',
        'category_id',
        'staff_id',
        'createdAt',
      ],
      offset,
      limit,
    });
    const totalCount = await this.productRepository.count();
    const totalPages = Math.ceil(totalCount / limit);
    const response = {
      status: 200,
      data: {
        records: allProducts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
        },
      },
      success: true,
    };
    return response;
  }

  async findOne(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const productExist = await this.productRepository.findOne({
      where: { id },
      include: [Image],
      attributes: [
        'id',
        'name',
        'price',
        'description',
        'category_id',
        'staff_id',
        'createdAt',
      ],
    });
    if (!productExist) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const response = {
      status: 200,
      data: productExist,
      success: true,
    };
    return response;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    authHeader: string,
  ) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const product = await this.findOne(id, authHeader);
    if (updateProductDto.category_id) {
      const categoryById = await this.getCategoryById(
        updateProductDto.category_id,
      );
      if (!categoryById) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
    }
    if (updateProductDto.staff_id) {
      const staffById = await this.getStaffById(updateProductDto.staff_id);
      if (!staffById) {
        throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
      }
    }
    await this.productRepository.update(updateProductDto, {
      where: { id },
    });
    return this.findOne(id, authHeader);
  }

  async remove(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const product = await this.findOne(id, authHeader);
    const images = await this.imageRepository.findAll({
      where: { product_id: product.data.id },
    });
    for (let i of images) {
      await this.imageRepository.destroy({ where: { id: i.id } });
      await this.imageService.removeFile(i.file_name);
    }
    await this.productRepository.destroy({
      where: { id },
    });
    return product;
  }

  async verifyAccessToken(authHeader: string) {
    try {
      const access_token = authHeader.split(' ')[1];
      const staff = await this.jwtService.verify(access_token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      return staff;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    return category;
  }

  async getStaffById(id: string) {
    const staff = await this.staffRepository.findOne({
      where: { id },
    });
    return staff;
  }
}
