import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryRequestDto {
  @ApiProperty({ example: 'Learning Other Tasks' })
  @IsNotEmpty()
  @IsString()
  title: string;
}
