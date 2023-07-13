import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ example: 'John Doe', description: "The user's full name" })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: '+998991234567',
    description: "The user's phone number",
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    example: '9980123412341234',
    description: "The user's card number",
  })
  @IsNotEmpty()
  @Length(16, 16)
  card: string;

  @ApiProperty({ example: 'ADMIN', description: "The user's role" })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ example: 'john77', description: "The user's login" })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'Uzbek1$t0n',
    description: "The user's password",
  })
  @IsNotEmpty()
  @IsString()
  // @MinLength(6)
  // @IsStrongPassword()
  password: string;
}
