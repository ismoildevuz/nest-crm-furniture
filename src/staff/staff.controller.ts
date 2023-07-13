import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Headers,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { LoginStaffDto } from './dto/login-staff.dto';
import { Staff } from './models/staff.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivateStaffDto } from './dto/activate-staff.dto';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: 'Register a new Staff' })
  @ApiResponse({ status: 201, type: Staff })
  @Post('auth/signup')
  async registration(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.registration(createStaffDto);
  }

  @ApiOperation({ summary: 'Log in an existing Staff' })
  @ApiResponse({ status: 200, type: Staff })
  @HttpCode(HttpStatus.OK)
  @Post('auth/signin')
  async login(@Body() loginStaffDto: LoginStaffDto) {
    return this.staffService.login(loginStaffDto);
  }

  // @ApiOperation({ summary: 'Log out a Staff' })
  // @ApiResponse({ status: 200, type: Staff })
  // @HttpCode(HttpStatus.OK)
  // @Post('signout')
  // async logout(@Headers('Authorization') authHeader: string) {
  //   return this.staffService.logout(authHeader);
  // }

  @ApiOperation({ summary: 'Get all Staffs' })
  @ApiResponse({ status: 200, type: [Staff] })
  @Get('')
  async findAll(
    @Query('page') page: number,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.staffService.findAll(page, authHeader);
  }

  @ApiOperation({ summary: 'Get a Staff by ID' })
  @ApiResponse({ status: 200, type: Staff })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.staffService.findOne(id, authHeader);
  }

  @ApiOperation({ summary: 'Update a Staff by ID' })
  @ApiResponse({ status: 200, type: Staff })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.staffService.update(id, updateStaffDto, authHeader);
  }

  @ApiOperation({ summary: 'Delete a Staff by ID' })
  @ApiResponse({ status: 200, type: Staff })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.staffService.remove(id, authHeader);
  }

  @ApiOperation({ summary: 'Activate/deactivate a Staff by ID' })
  @ApiResponse({ status: 200, type: Staff })
  @Post(':id')
  async activate(
    @Body() activateStaffDto: ActivateStaffDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.staffService.activate(activateStaffDto, authHeader);
  }
}
