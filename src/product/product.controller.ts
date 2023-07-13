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
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new Product' })
  @ApiResponse({ status: 201, type: Product })
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.productService.create(createProductDto, images, authHeader);
  }

  @ApiOperation({ summary: 'Get all Products' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get()
  async findAll(
    @Query('page') page: number,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.productService.findAll(page, authHeader);
  }

  @ApiOperation({ summary: 'Get a Product by ID' })
  @ApiResponse({ status: 200, type: Product })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.productService.findOne(id, authHeader);
  }

  @ApiOperation({ summary: 'Update a Product by ID' })
  @ApiResponse({ status: 200, type: Product })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.productService.update(id, updateProductDto, authHeader);
  }

  @ApiOperation({ summary: 'Delete a Product by ID' })
  @ApiResponse({ status: 200, type: Product })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.productService.remove(id, authHeader);
  }
}
