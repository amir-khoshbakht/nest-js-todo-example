import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createUser(username: string, hashedPassword: string | null) {
    try {
      await this.userModel.create({ username, password: hashedPassword });
    } catch (error) {
      // MongoDB duplicate key error
      if (error.code === 11000) {
        throw new ConflictException('Username already exists.');
      }
      throw error;
    }
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).lean();
  }
}
