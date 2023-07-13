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
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './models/region.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Region')
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @ApiOperation({ summary: 'Create a new Region' })
  @ApiResponse({ status: 201, type: Region })
  @Post()
  async create(
    @Body() createRegionDto: CreateRegionDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.regionService.create(createRegionDto, authHeader);
  }

  @ApiOperation({ summary: 'Get all Regions' })
  @ApiResponse({ status: 200, type: [Region] })
  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.regionService.findAll(authHeader);
  }

  @ApiOperation({ summary: 'Get a Region by ID' })
  @ApiResponse({ status: 200, type: Region })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.regionService.findOne(id, authHeader);
  }

  @ApiOperation({ summary: 'Update a Region by ID' })
  @ApiResponse({ status: 200, type: Region })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.regionService.update(id, updateRegionDto, authHeader);
  }

  @ApiOperation({ summary: 'Delete a Region by ID' })
  @ApiResponse({ status: 200, type: Region })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.regionService.remove(id, authHeader);
  }
}
