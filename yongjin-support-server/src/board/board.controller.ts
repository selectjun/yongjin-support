import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BOARD_BLOCK_SIZE } from 'src/common/constants';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';

/**
 * 게시판 Controller
 */
@Controller('board')
export class BoardController {
  /**
   * 생성자
   * @param boardService 게시판 Service
   */
  constructor(private boardService: BoardService) {}

  /**
   * 게시물 조회
   */
  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  async getBoard(@Param('_id') _id: Types.ObjectId) {
    const board = await this.boardService.getBoard(_id);

    return {
      board,
    };
  }

  /**
   * 게시물 목록 조회
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getBoardList(@ReqUser() user, @Query('page') page: number = 1) {
    const boardList = await this.boardService.getBoardList(user.userId, page);
    const total = await this.boardService.countBoard(user.userId);

    return {
      boardList,
      page,
      blockSize: BOARD_BLOCK_SIZE,
      total,
    };
  }

  /**
   * 게시물 생성
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@ReqUser() user, @Body() createBoardDto: CreateBoardDto) {
    const board = await this.boardService.createBoard(
      user.userId,
      createBoardDto,
    );

    return {
      board,
    };
  }

  /**
   * 게시물 수정
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  async updateBoard(
    @ReqUser() user,
    @Param('_id') _id: Types.ObjectId,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const board = await this.boardService.updateBoard(
      _id,
      user.userId,
      updateBoardDto,
    );

    return {
      board,
    };
  }

  /**
   * 게시물 삭제
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async deleteBoard(@ReqUser() user, @Param('_id') _id: Types.ObjectId) {
    const board = await this.boardService.deleteBoard(_id, user.userId);

    return {
      board,
    };
  }
}
