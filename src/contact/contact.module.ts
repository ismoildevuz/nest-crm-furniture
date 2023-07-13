import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contact } from './models/contact.model';
import { JwtModule } from '@nestjs/jwt';
import { Staff } from '../staff/models/staff.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Contact, Staff]),
    JwtModule.register({}),
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
