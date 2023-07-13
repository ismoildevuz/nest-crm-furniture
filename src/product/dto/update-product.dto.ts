import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Chair',
    description: 'The name of the Product',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 55000,
    description: 'The price of the Product',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Product',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The ID of the Category',
  })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The ID of the Staff',
  })
  @IsOptional()
  @IsString()
  staff_id?: string;
}
