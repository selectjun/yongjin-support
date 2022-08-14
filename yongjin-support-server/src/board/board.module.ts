import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { FileUtil } from 'src/utils/file.util';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board, BoardSchema } from './schemas/board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        dest: `${config.get('UPLOAD_BASIC_DIRECTORY')}/board`,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService, FileUtil],
})
export class BoardModule {}
