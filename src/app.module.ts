import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import appConfig from './config/app.config';
import mongoDbConfig from './config/mongo-db.config';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoInMem: MongoMemoryServer;

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, mongoDbConfig], isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isDevelopment = config.getOrThrow<boolean>(
          'APP.ENV_IS_DEVELOPMENT',
        );
        const isTest = config.getOrThrow<boolean>('APP.ENV_IS_TEST');
        // if (isDevelopment || isTest) mongoose.set('debug', true);

        if (isTest) {
          mongoInMem = await MongoMemoryServer.create();
          const uri = mongoInMem.getUri();
          return { uri };
        }

        return { uri: config.getOrThrow('MONGO_DB.URI'), retryDelay: 1 };
      },
    }),
    AuthModule,
    UserModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  async onModuleDestroy() {
    await mongoInMem.stop();
  }
}
