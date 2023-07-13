import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './models/contact.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4, v4 } from 'uuid';
import { Staff } from '../staff/models/staff.model';

const roles = ['SUPER-ADMIN', 'OPERATOR'];
const statuses = ['busy', 'non-exist', 'cancel'];

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact) private contactRepository: typeof Contact,
    @InjectModel(Staff) private staffRepository: typeof Staff,
    private readonly jwtService: JwtService,
  ) {}

  async create(createContactDto: CreateContactDto, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const contactByPhoneNumber = await this.getContactByPhoneNumber(
      createContactDto.phone_number,
    );
    if (contactByPhoneNumber) {
      throw new BadRequestException('Phone Number already exists!');
    }
    const staffById = await this.getStaffById(createContactDto.staff_id);
    if (!staffById) {
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
    }
    const newContact = await this.contactRepository.create({
      id: uuidv4(),
      unique_id: await this.generateUniqueId(),
      ...createContactDto,
    });
    const contactData = await this.contactRepository.findOne({
      where: { id: newContact.id },
      attributes: [
        'id',
        'phone_number',
        'unique_id',
        'status',
        'is_old',
        'createdAt',
        'staff_id',
      ],
    });
    const response = {
      status: 200,
      data: contactData,
      success: true,
    };
    return response;
  }

  async findAll(page: number, authHeader: string) {
    page = Number(page);
    const staff = await this.verifyAccessToken(authHeader);
    const staffExist = await this.staffRepository.findOne({
      where: { id: staff.id },
    });
    if (!staffExist) {
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
    }
    const limit = 10;
    const offset = (page - 1) * limit;
    const allContacts = await this.contactRepository.findAll({
      attributes: [
        'id',
        'phone_number',
        'unique_id',
        'status',
        'is_old',
        'createdAt',
        'staff_id',
      ],
      offset,
      limit,
    });
    const totalCount = await this.contactRepository.count();
    const totalPages = Math.ceil(totalCount / limit);
    const response = {
      status: 200,
      data: {
        records: allContacts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
        },
      },
      success: true,
    };
    return response;
  }

  async findOne(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const contactExist = await this.contactRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'phone_number',
        'unique_id',
        'status',
        'is_old',
        'createdAt',
        'staff_id',
      ],
    });
    if (!contactExist) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    const response = {
      status: 200,
      data: contactExist,
      success: true,
    };
    return response;
  }

  async findOneByUniqueId(unique_id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    const contactExist = await this.contactRepository.findOne({
      where: { unique_id },
      attributes: [
        'id',
        'phone_number',
        'unique_id',
        'status',
        'is_old',
        'createdAt',
        'staff_id',
      ],
    });
    if (!contactExist) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    const response = {
      status: 200,
      data: contactExist,
      success: true,
    };
    return response;
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    authHeader: string,
  ) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const contact = await this.findOne(id, authHeader);
    if (updateContactDto.phone_number) {
      const contactByPhoneNumber = await this.getContactByPhoneNumber(
        updateContactDto.phone_number,
      );
      if (contactByPhoneNumber && contactByPhoneNumber.id != contact.data.id) {
        throw new BadRequestException('Phone number already exists!');
      }
    }
    if (updateContactDto.unique_id) {
      const contactByUniqueId = await this.getContactByUniqueId(
        updateContactDto.unique_id,
      );
      if (contactByUniqueId && contactByUniqueId.id != contact.data.id) {
        throw new BadRequestException('Unique ID already exists!');
      }
    }
    if (updateContactDto.status) {
      if (!statuses.includes(updateContactDto.status)) {
        throw new BadRequestException(
          `Status must be one of following: ${statuses}`,
        );
      }
    }
    if (updateContactDto.staff_id) {
      const staffById = await this.getStaffById(updateContactDto.staff_id);
      if (!staffById) {
        throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
      }
    }
    await this.contactRepository.update(updateContactDto, {
      where: { id },
    });
    return this.findOne(id, authHeader);
  }

  async remove(id: string, authHeader: string) {
    const staff = await this.verifyAccessToken(authHeader);
    if (!roles.includes(staff.role)) {
      throw new UnauthorizedException('Restricted action');
    }
    const contact = await this.findOne(id, authHeader);
    await this.contactRepository.destroy({
      where: { id },
    });
    return contact;
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

  async generateId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const suffix = Math.floor(Math.random() * 9000) + 1000;
    return prefix + suffix;
  }

  async generateUniqueId() {
    const allUniqueIds = await this.contactRepository.findAll({
      attributes: ['unique_id'],
    });
    let unique_id: any;
    while (true) {
      unique_id = await this.generateId();
      if (!allUniqueIds.includes(unique_id)) {
        break;
      }
    }
    return unique_id;
  }

  async getContactByUniqueId(unique_id: string) {
    const contact = await this.contactRepository.findOne({
      where: { unique_id },
    });
    return contact;
  }

  async getContactByPhoneNumber(phone_number: string) {
    const contact = await this.contactRepository.findOne({
      where: { phone_number },
    });
    return contact;
  }

  async getStaffById(id: string) {
    const staff = await this.staffRepository.findOne({
      where: { id },
    });
    return staff;
  }
}
