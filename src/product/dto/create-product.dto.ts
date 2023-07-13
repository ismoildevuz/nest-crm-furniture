import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Chair',
    description: 'The name of the Product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 55000,
    description: 'The price of the Product',
  })
  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Product',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The ID of the Category',
  })
  @IsNotEmpty()
  @IsString()
  category_id: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The ID of the Staff',
  })
  @IsNotEmpty()
  @IsString()
  staff_id: string;
}
