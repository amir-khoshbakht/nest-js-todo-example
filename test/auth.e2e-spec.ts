import { LoginResponseDto } from '../src/auth/dto/login.response.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RegisterRequestDto } from '../src/auth/dto/register.request.dto';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import mongoose from 'mongoose';
import { User, UserSchema } from '../src/user/schema/user.schema';
import { UserService } from '../src/user/user.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let httpClient: request.SuperTest<request.Test>;
  let userService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    httpClient = request(app.getHttpServer());

    await app.init();
    userService = moduleFixture.get(UserService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/register (POST) should register user', async () => {
    const body: RegisterRequestDto = {
      username: 'username',
      password: 'secreT0?',
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(body)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('/auth/login (POST) should login user and return an access token', async () => {
    const username = 'username';
    const password = 'secreT0?';

    const salt = genSaltSync();
    const passwordHash = await hashSync(password, salt);

    await userService.createUser(username, passwordHash);

    const loginDto = { username, password };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(HttpStatus.OK);

    /** @see LoginResponseDto  */
    expect(typeof response.body.token).toBe('string');
    expect(response.body).toHaveProperty('token');
  });
});
