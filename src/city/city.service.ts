import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './models/city.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4, v4 } from 'uuid';
import { Region } from '../region/models/region.model';

const roles = ['SUPER-ADMIN', 'ADMIN'];

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City) private cityRepository: typeof City,
    @InjectModel(Region) private regionRepository: typeof Region,
    private readonly jwtService: JwtService,
  ) {}

  async create(createCityDto: CreateCityDto, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const cityByName = await this.getCityByName(createCityDto.name);
    if (cityByName) {
      throw new BadRequestException('This City already exists!');
    }
    const regionById = await this.getRegionById(createCityDto.region_id);
    if (!regionById) {
      throw new HttpException('Region not found', HttpStatus.NOT_FOUND);
    }
    const newCity = await this.cityRepository.create({
      id: uuidv4(),
      ...createCityDto,
    });
    const cityData = await this.cityRepository.findOne({
      where: { id: newCity.id },
      attributes: ['id', 'name', 'region_id', 'createdAt'],
    });
    const response = {
      status: 200,
      data: cityData,
      success: true,
    };
    return response;
  }

  async findAll(region, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const allCity = await this.cityRepository.findAll({
      where: { region_id: region },
      attributes: ['id', 'name', 'region_id', 'createdAt'],
    });
    const response = {
      status: 200,
      data: allCity,
      success: true,
    };
    return response;
  }

  async findOne(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const cityExist = await this.cityRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'region_id', 'createdAt'],
    });
    if (!cityExist) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }
    const response = {
      status: 200,
      data: cityExist,
      success: true,
    };
    return response;
  }

  async update(id: string, updateCityDto: UpdateCityDto, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const city = await this.findOne(id, authHeader);
    if (updateCityDto.name) {
      const cityByName = await this.getCityByName(updateCityDto.name);
      if (cityByName && cityByName.id != city.data.id) {
        throw new BadRequestException('This City already exists!');
      }
    }
    if (updateCityDto.region_id) {
      const regionById = await this.getRegionById(updateCityDto.region_id);
      if (!regionById) {
        throw new HttpException('Region not found', HttpStatus.NOT_FOUND);
      }
    }
    await this.cityRepository.update(updateCityDto, {
      where: { id },
    });
    return this.findOne(id, authHeader);
  }

  async remove(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const city = await this.findOne(id, authHeader);
    await this.cityRepository.destroy({
      where: { id },
    });
    return city;
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

  async getCityByName(name: string) {
    const city = await this.cityRepository.findOne({
      where: { name },
    });
    return city;
  }

  async getRegionById(id: string) {
    const staff = await this.regionRepository.findOne({
      where: { id },
    });
    return staff;
  }
}
