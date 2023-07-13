import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    example: 'Order',
    description: 'The full name of the Order',
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({
    example: 'Tashkent, Yunusabad',
    description: 'The address of the Order',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Market',
    description: 'The target of the Order',
  })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiProperty({
    example: 'accepted',
    description: 'The status of the Order',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Order',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Product',
  })
  @IsOptional()
  @IsString()
  product_id?: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Staff',
  })
  @IsOptional()
  @IsString()
  staff_id?: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the City',
  })
  @IsOptional()
  @IsString()
  city_id?: string;

  @ApiProperty({
    example: '3d98e556-4287-402b-8182-e681ff840201',
    description: 'The id of the Contact',
  })
  @IsOptional()
  @IsString()
  contact_id?: string;
}
