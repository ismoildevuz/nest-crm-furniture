import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './models/order.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new Order' })
  @ApiResponse({ status: 201, type: Order })
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.orderService.create(createOrderDto, authHeader);
  }

  @ApiOperation({ summary: 'Get all Orders' })
  @ApiResponse({ status: 200, type: [Order] })
  @Get()
  async findAll(
    @Query('page') page: number,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.orderService.findAll(page, authHeader);
  }

  @ApiOperation({ summary: 'Get a Order by ID' })
  @ApiResponse({ status: 200, type: Order })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.orderService.findOne(id, authHeader);
  }

  @ApiOperation({ summary: 'Update a Order by ID' })
  @ApiResponse({ status: 200, type: Order })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.orderService.update(id, updateOrderDto, authHeader);
  }

  @ApiOperation({ summary: 'Delete a Order by ID' })
  @ApiResponse({ status: 200, type: Order })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.orderService.remove(id, authHeader);
  }
}
