import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './models/city.model';
import { JwtModule } from '@nestjs/jwt';
import { Region } from '../region/models/region.model';

@Module({
  imports: [SequelizeModule.forFeature([City, Region]), JwtModule.register({})],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
