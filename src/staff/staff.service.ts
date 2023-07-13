import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { LoginStaffDto } from './dto/login-staff.dto';
import { ActivateStaffDto } from './dto/activate-staff.dto';
import { Staff } from './models/staff.model';
import { roles } from '../constants/roles.js';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4, v4 } from 'uuid';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff) private staffRepository: typeof Staff,
    private readonly jwtService: JwtService,
  ) {}

  async registration(createStaffDto: CreateStaffDto) {
    if (!roles.includes(createStaffDto.role)) {
      throw new BadRequestException(`Role must be one of following: ${roles}`);
    }
    const login = await this.getStaffByLogin(createStaffDto.login);
    if (login) {
      throw new BadRequestException('Login already registered!');
    }
    const phone_number = await this.getStaffByPhoneNumber(
      createStaffDto.phone_number,
    );
    if (phone_number) {
      throw new BadRequestException('Phone number already registered!');
    }
    const hashed_password = await bcrypt.hash(createStaffDto.password, 7);
    const newStaff = await this.staffRepository.create({
      id: uuidv4(),
      ...createStaffDto,
      hashed_password,
    });
    const tokens = await this.getTokens(newStaff);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedStaff = await this.staffRepository.update(
      {
        hashed_refresh_token,
      },
      {
        where: { id: newStaff.id },
      },
    );
    const staffData = await this.staffRepository.findOne({
      where: { id: newStaff.id },
      attributes: ['id', 'role', 'is_active'],
    });
    const response = {
      status: 200,
      data: {
        token: tokens.access_token,
        staff: staffData,
      },
      success: true,
    };
    return response;
  }

  async login(loginStaffDto: LoginStaffDto) {
    const { login, password } = loginStaffDto;
    const staff = await this.getStaffByLogin(login);
    if (!staff) {
      throw new UnauthorizedException('Login or password is wrong');
    }
    const isMatchPass = await bcrypt.compare(password, staff.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException('Login or password is wrong');
    }
    if (!staff.is_active) {
      throw new UnauthorizedException('Staff is not active');
    }
    const tokens = await this.getTokens(staff);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedStaff = await this.staffRepository.update(
      {
        hashed_refresh_token,
      },
      {
        where: { id: staff.id },
      },
    );
    const staffData = await this.staffRepository.findOne({
      where: { id: staff.id },
      attributes: ['id', 'role', 'is_active'],
    });
    const response = {
      status: 200,
      data: {
        token: tokens.access_token,
        staff: staffData,
      },
      success: true,
    };
    return response;
  }

  // async logout(res: Response, accessToken: string) {
  //   const Staff = await this.jwtService.verify(accessToken, {
  //     secret: process.env.ACCESS_TOKEN_KEY,
  //   });
  //   if (!Staff) {
  //     throw new ForbiddenException('Staff not found');
  //   }
  //   const updatedStaff = await this.staffRepository.update(
  //     { hashed_refresh_token: null },
  //     { where: { id: Staff.id }, returning: true },
  //   );
  //   const StaffData = await this.staffRepository.findOne({
  //     where: { id: Staff.id },
  //     attributes: ['id', 'fullname', 'email'],
  //   });
  //   res.clearCookie('access_token');
  //   const response = {
  //     message: 'Staff logged out',
  //     Staff: StaffData,
  //   };
  //   return response;
  // }

  async findAll(page: number, authHeader: string) {
    page = Number(page);
    const staff = await this.verifyAccessToken(authHeader);
    const staffExist = await this.staffRepository.findOne({
      where: { id: staff.id },
    });
    if (!staffExist) {
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
    }
    if (staffExist.role !== 'SUPER-ADMIN') {
      throw new UnauthorizedException('Restricted action');
    }
    const limit = 10;
    const offset = (page - 1) * limit;
    const allStaffs = await this.staffRepository.findAll({
      attributes: [
        'id',
        'login',
        'full_name',
        'phone_number',
        'role',
        'card',
        'is_active',
      ],
      offset,
      limit,
    });
    const totalCount = await this.staffRepository.count();
    const totalPages = Math.ceil(totalCount / limit);
    const response = {
      status: 200,
      data: {
        records: allStaffs,
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
    if (staff.role !== 'SUPER-ADMIN') {
      throw new UnauthorizedException('Restricted action');
    }
    const staffExist = await this.staffRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'login',
        'full_name',
        'phone_number',
        'role',
        'card',
        'is_active',
      ],
    });
    if (!staffExist) {
      throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
    }
    const response = {
      status: 200,
      data: staffExist,
      success: true,
    };
    return response;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, authHeader: string) {
    const staff = await this.findOne(id, authHeader);
    if (updateStaffDto.login) {
      const staffByLogin = await this.getStaffByLogin(updateStaffDto.login);
      if (staffByLogin && staffByLogin.id != staff.data.id) {
        throw new BadRequestException('Login already registered by someone!');
      }
    }
    if (updateStaffDto.password) {
      const hashed_password = await bcrypt.hash(updateStaffDto.password, 7);
      await this.staffRepository.update(
        { hashed_password },
        {
          where: { id },
        },
      );
    }
    if (updateStaffDto.phone_number) {
      const staffByPhoneNumber = await this.getStaffByPhoneNumber(
        updateStaffDto.phone_number,
      );
      if (staffByPhoneNumber && staffByPhoneNumber.id != staff.data.id) {
        throw new BadRequestException(
          'Phone number already registered by someone!',
        );
      }
    }
    if (updateStaffDto.role) {
      if (!roles.includes(updateStaffDto.role)) {
        throw new BadRequestException(
          `Role must be one of following: ${roles}`,
        );
      }
    }
    await this.staffRepository.update(updateStaffDto, {
      where: { id },
    });
    return this.findOne(id, authHeader);
  }

  async remove(id: string, authHeader: string) {
    const staff = await this.findOne(id, authHeader);
    await this.staffRepository.destroy({
      where: { id },
    });
    return staff;
  }

  async activate(activateStaffDto: ActivateStaffDto, authHeader: string) {
    const { id, is_active } = activateStaffDto;
    const staff = await this.findOne(id, authHeader);
    await this.staffRepository.update(
      { is_active },
      {
        where: { id },
      },
    );
    11;
    return this.findOne(id, authHeader);
  }

  async getTokens(staff: Staff) {
    const jwtPayload = {
      id: staff.id,
      role: staff.role,
      is_active: staff.is_active,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
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

  async getStaffByLogin(login: string) {
    const staff = await this.staffRepository.findOne({
      where: { login },
    });
    return staff;
  }

  async getStaffByPhoneNumber(phone_number: string) {
    const staff = await this.staffRepository.findOne({
      where: { phone_number },
    });
    return staff;
  }
}
