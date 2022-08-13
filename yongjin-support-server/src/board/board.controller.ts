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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
@ApiTags('board')
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
  @ApiOkResponse({
    description: '게시물을 조회하였습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @ApiParam({ name: '_id' })
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
  @ApiOkResponse({
    description: '게시물 목록을 조회하였습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @ApiQuery({ name: 'page', type: Number })
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
  @ApiCreatedResponse({
    description: '게시물이 생성되었습니다.',
  })
  @ApiBadRequestResponse({
    description: '요청 데이터가 누락되었습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @ApiBody({ type: CreateBoardDto })
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
  @ApiOkResponse({
    description: '게시물 수정을 하였습니다.',
  })
  @ApiBadRequestResponse({
    description: '요청 데이터가 누락되었습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @ApiParam({ name: '_id', description: '게시물 ID' })
  @ApiBody({ type: UpdateBoardDto })
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
  @ApiOkResponse({
    description: '게시물 목록을 조회하였습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async deleteBoard(@ReqUser() user, @Param('_id') _id: Types.ObjectId) {
    const board = await this.boardService.deleteBoard(_id, user.userId);

    return {
      board,
    };
  }
}
