import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Order',
    description: 'The full name of the Order',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: 'Tashkent, Yunusabad',
    description: 'The address of the Order',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: 'Market',
    description: 'The target of the Order',
  })
  @IsNotEmpty()
  @IsString()
  target: string;

  @ApiProperty({
    example: 'accepted',
    description: 'The status of the Order',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Order',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Product',
  })
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Staff',
  })
  @IsNotEmpty()
  @IsString()
  staff_id: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the City',
  })
  @IsNotEmpty()
  @IsString()
  city_id: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Contact',
  })
  @IsNotEmpty()
  @IsString()
  contact_id: string;
}
