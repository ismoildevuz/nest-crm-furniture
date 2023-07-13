import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the Contact',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Staff',
  })
  @IsNotEmpty()
  @IsString()
  staff_id: string;
}
