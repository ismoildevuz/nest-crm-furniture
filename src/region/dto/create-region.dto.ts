import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({
    example: 'Tashkent',
    description: 'The name of the Region',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
