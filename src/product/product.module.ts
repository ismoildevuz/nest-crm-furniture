import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { JwtModule } from '@nestjs/jwt';
import { Image } from '../image/models/image.model';
import { Category } from '../category/models/category.model';
import { Staff } from '../staff/models/staff.model';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Image, Category, Staff]),
    ImageModule,
    JwtModule.register({}),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
