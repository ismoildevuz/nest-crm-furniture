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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './models/contact.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: 'Create a new Contact' })
  @ApiResponse({ status: 201, type: Contact })
  @Post()
  async create(
    @Body() createContactDto: CreateContactDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.contactService.create(createContactDto, authHeader);
  }

  @ApiOperation({ summary: 'Get all Contacts' })
  @ApiResponse({ status: 200, type: [Contact] })
  @Get()
  async findAll(
    @Query('page') page: number,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.contactService.findAll(page, authHeader);
  }

  @ApiOperation({ summary: 'Get a Contact by ID' })
  @ApiResponse({ status: 200, type: Contact })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.contactService.findOne(id, authHeader);
  }

  @ApiOperation({ summary: 'Get a Contact by unique ID' })
  @ApiResponse({ status: 200, type: Contact })
  @Get('search/byUniqueId')
  async findOneByUniqueId(
    @Query('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.contactService.findOneByUniqueId(id, authHeader);
  }

  @ApiOperation({ summary: 'Update a Contact by ID' })
  @ApiResponse({ status: 200, type: Contact })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.contactService.update(id, updateContactDto, authHeader);
  }

  @ApiOperation({ summary: 'Delete a Contact by ID' })
  @ApiResponse({ status: 200, type: Contact })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.contactService.remove(id, authHeader);
  }
}
