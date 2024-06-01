import { registerAs } from '@nestjs/config';

export default registerAs('MONGO_DB', () => ({
  URI: process.env.MONGO_DB_URI,
}));
