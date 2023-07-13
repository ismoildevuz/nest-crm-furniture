import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './models/region.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4, v4 } from 'uuid';
import { City } from '../city/models/city.model';

const roles = ['SUPER-ADMIN', 'ADMIN'];

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region) private regionRepository: typeof Region,
    @InjectModel(City) private cityRepository: typeof City,
    private readonly jwtService: JwtService,
  ) {}

  async create(createRegionDto: CreateRegionDto, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const regionByName = await this.getRegionByName(createRegionDto.name);
    if (regionByName) {
      throw new BadRequestException('This Region already exists!');
    }
    const newRegion = await this.regionRepository.create({
      id: uuidv4(),
      ...createRegionDto,
    });
    const regionData = await this.regionRepository.findOne({
      where: { id: newRegion.id },
      attributes: ['id', 'name', 'createdAt'],
    });
    const response = {
      status: 200,
      data: regionData,
      success: true,
    };
    return response;
  }

  async findAll(authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const allRegions = await this.regionRepository.findAll({
      attributes: ['id', 'name', 'createdAt'],
    });
    const response = {
      status: 200,
      data: allRegions,
      success: true,
    };
    return response;
  }

  async findOne(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const regionExist = await this.regionRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'createdAt'],
    });
    if (!regionExist) {
      throw new HttpException('Region not found', HttpStatus.NOT_FOUND);
    }
    const response = {
      status: 200,
      data: regionExist,
      success: true,
    };
    return response;
  }

  async update(
    id: string,
    updateRegionDto: UpdateRegionDto,
    authHeader: string,
  ) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const region = await this.findOne(id, authHeader);
    if (updateRegionDto.name) {
      const regionByName = await this.getRegionByName(updateRegionDto.name);
      if (regionByName && regionByName.id != region.data.id) {
        throw new BadRequestException('This Region already exists!');
      }
    }
    await this.regionRepository.update(updateRegionDto, {
      where: { id },
    });
    return this.findOne(id, authHeader);
  }

  async remove(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const region = await this.findOne(id, authHeader);
    const allCity = await this.cityRepository.findAll({
      where: { region_id: region.data.id },
    });
    for (let i of allCity) {
      await this.cityRepository.destroy({ where: { id: i.id } });
    }
    await this.regionRepository.destroy({
      where: { id },
    });
    return region;
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

  async getRegionByName(name: string) {
    const region = await this.regionRepository.findOne({
      where: { name },
    });
    return region;
  }
}
