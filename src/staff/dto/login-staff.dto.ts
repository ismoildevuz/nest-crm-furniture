import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginStaffDto {
  @ApiProperty({
    example: 'john77',
    description: 'The login of the user',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'Uzbek1$t0n',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
