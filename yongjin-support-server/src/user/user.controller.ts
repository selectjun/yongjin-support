import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BoardService } from 'src/board/board.service';
import { USER_BOARD_BLOCK_SIZE } from 'src/common/constants';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { InternalServerErrorException } from 'src/common/exceptions/InternalServerErrorException';
import { UsernameDuplicateException } from 'src/common/exceptions/UsernameDuplicateException';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

/**
 * 사용자 Controller
 */
@ApiTags('user')
@Controller('api/user')
export class UserController {
  /**
   * 생성자
   * @param userService 사용자 Service
   */
  constructor(
    private userService: UserService,
    private boardService: BoardService,
  ) {}

  /**
   * 사용자 생성
   * @param createUserDto 사용자 생성 데이터
   * @returns 사용자 정보
   */
  @ApiCreatedResponse({
    description: '사용자가 생성되었습니다.',
  })
  @ApiBadRequestResponse({
    description: '요청 데이터가 누락되었습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @ApiBody({ type: CreateUserDto })
  @Post('')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      // 회원 중복 확인
      const isExistUser = await this.userService.isExistUser(
        createUserDto.username,
      );
      if (isExistUser) {
        throw new UsernameDuplicateException();
      }

      const user = await this.userService.createUser(createUserDto);

      return {
        data: { user },
        status: HttpStatus.CREATED,
        message: '사용자가 생성되었습니다.',
      };
    } catch (e) {
      const isUsernameDuplicateException = e
        .toString()
        .includes('UsernameDuplicateException');
      if (isUsernameDuplicateException) {
        throw e;
      } else {
        throw new InternalServerErrorException(
          '알 수 없는 에러가 발생하였습니다.',
        );
      }
    }
  }

  /**
   * 사용자 조회
   * @param user 사용자 정보
   * @returns 사용자 정보
   */
  @ApiOkResponse({
    description: '사용자를 조회하였습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUser(@ReqUser() user) {
    try {
      return {
        data: { user },
        status: HttpStatus.OK,
        message: '사용자를 조회하였습니다.',
      };
    } catch (e) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다.',
      );
    }
  }

  /**
   * 사용자 게시물 목록 조회
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
  @UseGuards(JwtAuthGuard)
  @Get('board')
  async getUserBoardList(@ReqUser() user, @Query('page') page: number = 1) {
    try {
      const boardList = await this.boardService.getBoardListByCreatedBy(
        user.userId,
        page,
      );
      const total = await this.boardService.countBoardByCreatedBy(user.userId);

      return {
        data: { boardList, page, blockSize: USER_BOARD_BLOCK_SIZE, total },
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
   * 사용자 게시물 조회
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
  @UseGuards(JwtAuthGuard)
  @Get('board/:id')
  async getUserBoard(@Param('_id') _id: Types.ObjectId) {
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
}
