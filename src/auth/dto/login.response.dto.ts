import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  static response(jwtToken: string) {
    return new this(jwtToken);
  }
  constructor(jwtToken: string) {
    this.token = jwtToken;
  }

  @ApiProperty({
    default: '',
    description: 'Jwt token.',
  })
  token: string;
}
