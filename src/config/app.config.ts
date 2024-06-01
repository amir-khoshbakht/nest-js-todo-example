import { registerAs } from '@nestjs/config';

export default registerAs('APP', () => ({
  // development, production, test
  NODE_ENV: process.env.NODE_ENV || 'production',
  ENV_IS_DEVELOPMENT: process.env.NODE_ENV == 'development',
  ENV_IS_TEST: process.env.NODE_ENV == 'test',
  SECRET: process.env.SECRET,
  PORT: process.env.PORT || 3000,
  NAME: process.env.NAME || 'NestJs Todo Example',
  DESCRIPTION: process.env.DESCRIPTION || 'NestJs Todo Example',
  VERSION: process.env.VERSION || '0.0.1',
  APP_LICENSE: process.env.APP_LICENSE || 'MIT',
  APP_LICENSE_URL: process.env.LICENSE_URL || '',
  API_PREFIX: process.env.API_PREFIX || 'api',
  SWAGGER_PATH: process.env.API_PREFIX || 'docs',
}));
