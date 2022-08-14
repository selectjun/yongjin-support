import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from 'src/board/board.module';
import { BoardService } from 'src/board/board.service';
import { PasswordEncoder } from 'src/utils/password-encoder.util';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * 사용자 Module
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BoardModule,
  ],
  controllers: [UserController],
  providers: [UserService, PasswordEncoder],
  exports: [UserService],
})
export class UserModule {}
