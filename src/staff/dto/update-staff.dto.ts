import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UpdateStaffDto {
  @ApiProperty({ example: 'John Doe', description: "The user's full name" })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({
    example: '+998991234567',
    description: "The user's phone number",
  })
  @IsOptional()
  @IsPhoneNumber()
  phone_number?: string;

  @ApiProperty({
    example: '9980123412341234',
    description: "The user's card number",
  })
  @IsOptional()
  @Length(16, 16)
  card?: string;

  @ApiProperty({ example: 'ADMIN', description: "The user's role" })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: 'john77', description: "The user's login" })
  @IsOptional()
  @IsString()
  login?: string;

  @ApiProperty({
    example: 'Uzbek1$t0n',
    description: "The user's password",
  })
  @IsOptional()
  @IsString()
  // @MinLength(6)
  // @IsStrongPassword()
  password?: string;
}
