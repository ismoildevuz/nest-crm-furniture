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
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './models/city.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiOperation({ summary: 'Create a new City' })
  @ApiResponse({ status: 201, type: City })
  @Post()
  async create(
    @Body() createCityDto: CreateCityDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.cityService.create(createCityDto, authHeader);
  }

  @ApiOperation({ summary: 'Get all Citys' })
  @ApiResponse({ status: 200, type: [City] })
  @Get()
  async findAll(
    @Query('region') region: number,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.cityService.findAll(region, authHeader);
  }

  @ApiOperation({ summary: 'Get a City by ID' })
  @ApiResponse({ status: 200, type: City })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.cityService.findOne(id, authHeader);
  }

  @ApiOperation({ summary: 'Update a City by ID' })
  @ApiResponse({ status: 200, type: City })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.cityService.update(id, updateCityDto, authHeader);
  }

  @ApiOperation({ summary: 'Delete a City by ID' })
  @ApiResponse({ status: 200, type: City })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.cityService.remove(id, authHeader);
  }
}
