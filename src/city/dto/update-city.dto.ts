import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCityDto {
  @ApiProperty({
    example: 'Tashkent',
    description: 'The name of the City',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Region',
  })
  @IsOptional()
  @IsString()
  region_id?: string;
}
