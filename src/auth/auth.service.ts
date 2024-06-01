// import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RegisterRequestDto } from './dto/register.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /** Register a new user using username and password. */
  async register(registerRequestDto: RegisterRequestDto) {
    const { username, password } = registerRequestDto;

    const salt = genSaltSync();
    const passwordHash = await hashSync(password, salt);

    await this.userService.createUser(username, passwordHash);
  }

  /** Login using username and password. */
  async login(loginRequest: LoginRequestDto) {
    const { username, password } = loginRequest;

    const user = await this.userService.findByUsername(username);

    // error if user doesn't exist
    if (!user) throw new NotFoundException('user not found!');

    const isPasswordCorrect = await compareSync(password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthorizedException("password doesn't match.");

    const token = await this.jwtService.sign({
      sub: user._id.toHexString(),
      //for demonstration only
      // is_admin: false,
    });

    return LoginResponseDto.response(token);
  }
}
