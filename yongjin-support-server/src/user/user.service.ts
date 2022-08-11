import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  //   private readonly users = [
  //     {
  //       userId: 1,
  //       username: 'john',
  //       password: 'changeme',
  //     },
  //     {
  //       userId: 2,
  //       username: 'maria',
  //       password: 'guess',
  //     },
  //   ];

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({ username });
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = new this.userModel({
      ...createUserDto,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await user.save();
  }
}
