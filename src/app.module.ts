import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { StaffModule } from './staff/staff.module';
import { Staff } from './staff/models/staff.model';
import { CategoryModule } from './category/category.module';
import { Category } from './category/models/category.model';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/models/contact.model';
import { ProductModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { Product } from './product/models/product.model';
import { Image } from './image/models/image.model';
import { RegionModule } from './region/region.module';
import { Region } from './region/models/region.model';
import { CityModule } from './city/city.module';
import { City } from './city/models/city.model';
import { OrderModule } from './order/order.module';
import { Order } from './order/models/order.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [Staff, Category, Contact, Product, Image, Region, City, Order],
      autoLoadModels: true,
      logging: false,
    }),
    StaffModule,
    CategoryModule,
    ContactModule,
    ProductModule,
    ImageModule,
    RegionModule,
    CityModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
