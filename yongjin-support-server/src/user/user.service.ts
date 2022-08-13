import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordEncoder } from 'src/utils/password-encoder.util';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

/**
 * 사용자 Service
 */
@Injectable()
export class UserService {
  /**
   * 생성자
   * @param userModel 사용자 Model
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private passwordEncoder: PasswordEncoder,
  ) {}

  /**
   * 사용자 조회
   * @param username 사용자 아이디
   * @returns 사용자 정보
   */
  async getUser(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({ username }).lean();
  }

  /**
   * 사용자 생성
   * @param createUserDto 사용자 생성 데이터
   * @returns 사용자 정보
   */
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const encodedPassword = this.passwordEncoder.encode(createUserDto.password);

    const user = new this.userModel({
      ...createUserDto,
      password: encodedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await user.save();

    const nextUser = await this.userModel.findOne({ _id: user._id }).lean();
    const { password, ...result } = nextUser;

    return result;
  }

  /**
   * 사용자 존재 여부 확인
   * @param username 사용자 아이디
   * @returns 사용자 존재 여부
   */
  async isExistUser(username: string): Promise<boolean> {
    const user = await this.getUser(username);

    return !!user;
  }
}
