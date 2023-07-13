import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../product/models/product.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Image, Product]),
    JwtModule.register({}),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
