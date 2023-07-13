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
  Res,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Image } from './models/image.model';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @ApiOperation({ summary: 'Get all Images' })
  @ApiResponse({ status: 200, type: [Image] })
  @Get()
  async findAll(
    @Query('product_id') product_id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.imageService.findAll(product_id, authHeader);
  }

  @Get(':imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    return this.imageService.getImage(imageName, res);
  }
}
