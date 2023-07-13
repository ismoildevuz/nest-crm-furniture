import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Soft',
    description: 'The name of the Category',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
