import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './models/order.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4, v4 } from 'uuid';
import { Staff } from '../staff/models/staff.model';
import { Contact } from '../contact/models/contact.model';
import { City } from '../city/models/city.model';
import { Product } from '../product/models/product.model';

const roles = ['SUPER-ADMIN', 'ADMIN', 'OPERATOR'];
const statuses = ['accepted', 'ordered', 'force-major'];

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Staff) private staffRepository: typeof Staff,
    @InjectModel(Contact) private contactRepository: typeof Contact,
    @InjectModel(City) private cityRepository: typeof City,
    private readonly jwtService: JwtService,
  ) {}

  async create(createOrderDto: CreateOrderDto, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    if (createOrderDto.status) {
      if (!statuses.includes(createOrderDto.status)) {
        throw new BadRequestException(
          `Status must be one of following: ${statuses}`,
        );
      }
    }
    const productById = await this.getProductById(createOrderDto.product_id);
    if (!productById) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const staffById = await this.getStaffById(createOrderDto.staff_id);
    if (!staffById) {
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
    }
    const cityById = await this.getCityById(createOrderDto.city_id);
    if (!cityById) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }
    const contactById = await this.getContactById(createOrderDto.contact_id);
    if (!contactById) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    const newOrder = await this.orderRepository.create({
      id: uuidv4(),
      ...createOrderDto,
    });
    const orderData = await this.orderRepository.findOne({
      where: { id: newOrder.id },
      attributes: [
        'id',
        'full_name',
        'address',
        'target',
        'status',
        'description',
        'createdAt',
        'product_id',
        'staff_id',
        'city_id',
        'contact_id',
      ],
    });
    const response = {
      status: 200,
      data: orderData,
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
    const allOrders = await this.orderRepository.findAll({
      attributes: [
        'id',
        'full_name',
        'address',
        'target',
        'status',
        'description',
        'createdAt',
        'product_id',
        'staff_id',
        'city_id',
        'contact_id',
      ],
      offset,
      limit,
    });
    const totalCount = await this.orderRepository.count();
    const totalPages = Math.ceil(totalCount / limit);
    const response = {
      status: 200,
      data: {
        records: allOrders,
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
    const orderExist = await this.orderRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'full_name',
        'address',
        'target',
        'status',
        'description',
        'createdAt',
        'product_id',
        'staff_id',
        'city_id',
        'contact_id',
      ],
    });
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    const response = {
      status: 200,
      data: orderExist,
      success: true,
    };
    return response;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const order = await this.findOne(id, authHeader);
    if (updateOrderDto.status) {
      if (!statuses.includes(updateOrderDto.status)) {
        throw new BadRequestException(
          `Status must be one of following: ${statuses}`,
        );
      }
    }
    if (updateOrderDto.product_id) {
      const productById = await this.getProductById(updateOrderDto.product_id);
      if (!productById) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
    }
    if (updateOrderDto.staff_id) {
      const staffById = await this.getStaffById(updateOrderDto.staff_id);
      if (!staffById) {
        throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
      }
    }
    if (updateOrderDto.city_id) {
      const cityById = await this.getCityById(updateOrderDto.city_id);
      if (!cityById) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }
    }
    if (updateOrderDto.contact_id) {
      const contactById = await this.getContactById(updateOrderDto.contact_id);
      if (!contactById) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
      }
    }
    await this.orderRepository.update(updateOrderDto, {
      where: { id },
    });
    return this.findOne(id, authHeader);
  }

  async remove(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const order = await this.findOne(id, authHeader);
    await this.orderRepository.destroy({
      where: { id },
    });
    return order;
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

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    return product;
  }

  async getStaffById(id: string) {
    const staff = await this.staffRepository.findOne({
      where: { id },
    });
    return staff;
  }

  async getCityById(id: string) {
    const city = await this.cityRepository.findOne({
      where: { id },
    });
    return city;
  }

  async getContactById(id: string) {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });
    return contact;
  }
}
