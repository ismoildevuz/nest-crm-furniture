import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { JwtModule } from '@nestjs/jwt';
import { Staff } from '../staff/models/staff.model';
import { Contact } from '../contact/models/contact.model';
import { City } from '../city/models/city.model';
import { Product } from '../product/models/product.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, Staff, Product, Contact, City]),
    JwtModule.register({}),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
