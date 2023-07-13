import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4, v4 } from 'uuid';
import { Product } from '../product/models/product.model';
import { ProductService } from './../product/product.service';

const roles = ['SUPER-ADMIN', 'ADMIN'];

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    @InjectModel(Product) private productRepository: typeof Product,
    private readonly productService: ProductService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const name = await this.getCategoryByName(createCategoryDto.name);
    if (name) {
      throw new BadRequestException('Name already exists!');
    }
    const newCategory = await this.categoryRepository.create({
      id: uuidv4(),
      ...createCategoryDto,
    });
    const categoryData = await this.categoryRepository.findOne({
      where: { id: newCategory.id },
      attributes: ['id', 'name', 'createdAt'],
    });
    const response = {
      status: 200,
      data: categoryData,
      success: true,
    };
    return response;
  }

  async findAll(authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const allCategorys = await this.categoryRepository.findAll({
      attributes: ['id', 'name', 'createdAt'],
    });
    const response = {
      status: 200,
      data: allCategorys,
      success: true,
    };
    return response;
  }

  async findOne(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const categoryExist = await this.categoryRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'createdAt'],
    });
    if (!categoryExist) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const response = {
      status: 200,
      data: categoryExist,
      success: true,
    };
    return response;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    authHeader: string,
  ) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const category = await this.findOne(id, authHeader);
    if (updateCategoryDto.name) {
      const categoryByName = await this.getCategoryByName(
        updateCategoryDto.name,
      );
      if (categoryByName && categoryByName.id != category.data.id) {
        throw new BadRequestException('Name already exists!');
      }
    }
    await this.categoryRepository.update(updateCategoryDto, {
      where: { id },
    });
    return this.findOne(id, authHeader);
  }

  async remove(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const category = await this.findOne(id, authHeader);
    const allProduct = await this.productRepository.findAll({
      where: { category_id: category.data.id },
    });
    for (let i of allProduct) {
      await this.productService.remove(i.id, authHeader);
    }
    await this.categoryRepository.destroy({
      where: { id },
    });
    return category;
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

  async getCategoryByName(name: string) {
    const category = await this.categoryRepository.findOne({
      where: { name },
    });
    return category;
  }
}
