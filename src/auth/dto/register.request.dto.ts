import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    default: 'Dennis MacAlistair Ritchie',
    description: 'The username of the user.',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 40)
  username: string;

  @ApiProperty({
    default: 'secreT0?',
    description:
      'A password containing : uppercase, lowercase, numbers and symbols.',
  })
  @IsNotEmpty()
  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minUppercase: 1, minSymbols: 1 },
    {
      message:
        'password is not strong enough. it most contain uppercase, lowercase, numbers and symbols',
    },
  )
  password: string;
}
