import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Image } from './models/image.model';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from '../product/models/product.model';
import { Response } from 'express';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image) private imageRepository: typeof Image,
    @InjectModel(Product) private productRepository: typeof Product,
    private readonly jwtService: JwtService,
  ) {}

  async createFile(images: Express.Multer.File[]) {
    try {
      const fileNames: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const fileName = (await this.generateUniqueFileName()) + '.jpg';
        const filePath = path.resolve(__dirname, '..', 'static');
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        fs.writeFileSync(path.join(filePath, fileName), images[i].buffer);
        fileNames.push(fileName);
      }
      return fileNames;
    } catch (error) {
      throw new HttpException(
        'Error with uploading images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(product_id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const productById = await this.getProductById(product_id);
    if (!productById) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const allImages = await this.imageRepository.findAll({
      where: { product_id },
      attributes: ['id', 'file_name', 'product_id', 'createdAt'],
    });
    const response = {
      status: 200,
      data: allImages,
      success: true,
    };
    return response;
  }

  getImage(imageName: string, res: Response) {
    const imagePath = path.join(__dirname, '..', 'static', imageName);
    if (!fs.existsSync(imagePath)) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    res.sendFile(imagePath);
  }

  async removeFile(fileName: string) {
    try {
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.rmSync(path.join(filePath, fileName));
      return fileName;
    } catch (error) {
      return 'Error with deleting images';
      // throw new HttpException(
      //   'Error with deleting images',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
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

  async generateFileName() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const suffix = Math.floor(Math.random() * 90000) + 10000;
    return prefix + suffix;
  }

  async generateUniqueFileName() {
    const allUniqueFileNames = await this.imageRepository.findAll({
      attributes: ['file_name'],
    });
    let file_name: any;
    while (true) {
      file_name = await this.generateFileName();
      if (!allUniqueFileNames.includes(file_name)) {
        break;
      }
    }
    return file_name;
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    return product;
  }
}
