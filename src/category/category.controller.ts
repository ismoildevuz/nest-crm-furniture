import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create a new Category' })
  @ApiResponse({ status: 201, type: Category })
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.categoryService.create(createCategoryDto, authHeader);
  }

  @ApiOperation({ summary: 'Get all Categorys' })
  @ApiResponse({ status: 200, type: [Category] })
  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.categoryService.findAll(authHeader);
  }

  @ApiOperation({ summary: 'Get a Category by ID' })
  @ApiResponse({ status: 200, type: Category })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.categoryService.findOne(id, authHeader);
  }

  @ApiOperation({ summary: 'Update a Category by ID' })
  @ApiResponse({ status: 200, type: Category })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.categoryService.update(id, updateCategoryDto, authHeader);
  }

  @ApiOperation({ summary: 'Delete a Category by ID' })
  @ApiResponse({ status: 200, type: Category })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.categoryService.remove(id, authHeader);
  }
}
