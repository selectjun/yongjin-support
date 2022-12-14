import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BOARD_BLOCK_SIZE } from 'src/common/constants';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { InternalServerErrorException } from 'src/common/exceptions/InternalServerErrorException';
import { FileService } from 'src/file/file.service';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';

/**
 * 게시판 Controller
 */
@ApiTags('board')
@Controller('api/board')
export class BoardController {
  /**
   * 생성자
   * @param boardService 게시판 Service
   * @param fileService 파일 Service
   */
  constructor(
    private boardService: BoardService,
    private fileService: FileService,
  ) {}

  /**
   * 게시물 조회
   * @param _id 게시물 ObjectId
   * @returns
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
  @Get(':_id')
  async getBoard(@Param('_id') _id: Types.ObjectId) {
    try {
      const board = await this.boardService.getBoard(_id);

      return {
        data: { board },
        status: HttpStatus.OK,
        message: '게시물을 조회하였습니다.',
      };
    } catch (e) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다.',
      );
    }
  }

  /**
   * 게시물 목록 조회
   * @param user 사용자 정보
   * @param page 게시물 페이지
   * @returns
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
  @Get()
  async getBoardList(@Query('page') page: number = 1) {
    try {
      const boardList = await this.boardService.getBoardList(page);
      const total = await this.boardService.countBoard();

      return {
        data: { boardList, page, blockSize: BOARD_BLOCK_SIZE, total },
        status: HttpStatus.OK,
        message: '게시물 목록을 조회하였습니다.',
      };
    } catch (e) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다.',
      );
    }
  }

  /**
   * 게시물 생성
   * @param user 사용자 정보
   * @param createBoardDto 사용자 생성 데이터
   * @returns
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
  @UseInterceptors(FileInterceptor('attachments'))
  @Post()
  async createBoard(
    @ReqUser() user,
    @Body() createBoardDto: CreateBoardDto,
    @UploadedFile() attachments: Express.Multer.File,
  ) {
    try {
      const phigicalFile = this.fileService.getPhigicalFileFormat(attachments);

      await this.boardService.createBoard(
        user.userId,
        createBoardDto,
        phigicalFile,
      );

      return {
        status: HttpStatus.CREATED,
        message: '게시물이 생성되었습니다.',
      };
    } catch (e) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다.',
      );
    }
  }

  /**
   * 게시물 수정
   * @param user 사용자 정보
   * @param _id 게시물 ObjectId
   * @param updateBoardDto 게시물 수정 데이터
   * @param attachments 첨부파일
   * @returns
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
  @UseInterceptors(FileInterceptor('attachments'))
  @Patch(':_id')
  async updateBoard(
    @ReqUser() user,
    @Param('_id') _id: Types.ObjectId,
    @Body() updateBoardDto: UpdateBoardDto,
    @UploadedFile() attachments: Express.Multer.File,
  ) {
    try {
      const phigicalFile = this.fileService.getPhigicalFileFormat(attachments);

      await this.boardService.updateBoard(
        _id,
        user.userId,
        updateBoardDto,
        phigicalFile,
      );

      return {
        status: HttpStatus.OK,
        message: '게시물 수정을 하였습니다.',
      };
    } catch (e) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다.',
      );
    }
  }

  /**
   * 게시물 삭제
   * @param user 사용자 정보
   * @param _id 게시물 ObjectId
   * @returns
   */
  @ApiOkResponse({
    description: '게시물 삭제하였습니다.',
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
    try {
      await this.boardService.deleteBoard(_id, user.userId);

      return {
        status: HttpStatus.OK,
        message: '게시물 삭제하였습니다.',
      };
    } catch (e) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다.',
      );
    }
  }
}
