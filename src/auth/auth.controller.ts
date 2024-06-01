import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RegisterRequestDto } from './dto/register.request.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user',
  })
  @ApiNoContentResponse({ description: 'Register process was successful.' })
  @ApiConflictResponse({
    description: 'If username already exists.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Username already exists.' },
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('register')
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    await this.authService.register(registerRequestDto);
  }

  @ApiOperation({
    summary: 'Login',
    description: `Returns JWT token if valid user exists.`,
  })
  @ApiUnauthorizedResponse({
    description: 'password does not match.',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginRequest: LoginRequestDto) {
    return this.authService.login(loginRequest);
  }
}
