import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    example: 'Tashkent',
    description: 'The name of the City',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Region',
  })
  @IsNotEmpty()
  @IsString()
  region_id: string;
}
