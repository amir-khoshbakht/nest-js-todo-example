import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    default: 'Dennis MacAlistair Ritchie',
    description: 'The username.',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ default: 'secreT0?', description: 'your password.' })
  @IsNotEmpty()
  @Length(2, 40)
  password: string;
}
