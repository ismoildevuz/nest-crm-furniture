import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ActivateStaffDto {
  @ApiProperty({
    example: '69fd2954-dc99-45b3-885a-c1a4483ba07f',
    description: 'ID of the Staff',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    example: true,
    description: 'Status of the Staff',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}
