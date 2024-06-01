import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class TodoRequestDto {
  @ApiProperty({ example: 'signal-safety' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn async-signal-safe functionality.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @Min(0)
  @IsInt()
  priority: number;
}
