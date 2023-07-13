import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateContactDto {
  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the Contact',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone_number?: string;

  @ApiProperty({
    example: 'HH1001',
    description: 'The unique id of the Contact',
  })
  @IsOptional()
  @IsString()
  unique_id?: string;

  @ApiProperty({
    example: 'busy',
    description: 'The status of the Contact',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: true,
    description: 'The status of the Contact',
  })
  @IsOptional()
  @IsBoolean()
  is_old?: boolean;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Staff',
  })
  @IsOptional()
  @IsString()
  staff_id?: string;
}
