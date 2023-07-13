import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Region } from './models/region.model';
import { JwtModule } from '@nestjs/jwt';
import { City } from '../city/models/city.model';

@Module({
  imports: [SequelizeModule.forFeature([Region, City]), JwtModule.register({})],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
