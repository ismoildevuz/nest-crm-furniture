import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../product/models/product.model';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Category, Product]),
    ProductModule,
    JwtModule.register({}),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
