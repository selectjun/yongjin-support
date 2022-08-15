import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { BOARD_BLOCK_SIZE } from 'src/common/constants';
import { Attachments } from 'src/common/subschemas/attachments.subschema';
import { FileService } from 'src/file/file.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Board, BoardDocument } from './schemas/board.schema';

/**
 * 게시판 Service
 */
@Injectable()
export class BoardService {
  /**
   * 생성자
   * @param boardModel 게시판 Model
   */
  constructor(
    private configService: ConfigService,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    private fileService: FileService,
  ) {}

  /**
   * 게시물 조회
   * @param _id ObjectId
   * @returns 게시물
   */
  async getBoard(_id: Types.ObjectId) {
    const boards = await this.boardModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(_id), is_activate: true } },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$created_by',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: 'created_by',
        },
      },
      { $unwind: '$created_by' },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$updated_by',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: 'updated_by',
        },
      },
      { $unwind: '$updated_by' },
    ]);

    const [board] = boards;

    if (board && board?.attachments) {
      const {
        attachments: { fileName, originalName },
      } = board;

      board.attachments.url = `${this.fileService.getDownloadUrl(
        'board',
        fileName,
      )}?originalName=${originalName}`;
    }

    console.log(board);

    return board;
  }

  /**
   * 게시물 목록 조회
   * @param created_by 생성자 ObjectId
   * @param page 페이지
   * @returns 게시물 목록
   */
  async getBoardList(page: number) {
    const boards = await this.boardModel.aggregate([
      {
        $match: {
          is_activate: true,
        },
      },
      {
        $skip: page * BOARD_BLOCK_SIZE,
      },
      {
        $limit: BOARD_BLOCK_SIZE,
      },
      {
        $sort: {
          created_by: -1,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$created_by',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: 'created_by',
        },
      },
      { $unwind: '$created_by' },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$updated_by',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: 'updated_by',
        },
      },
      { $unwind: '$updated_by' },
    ]);

    const nextBoards = boards?.map((board) => {
      if (board && board?.attachments) {
        const {
          attachments: { fileName, originalName },
        } = board;

        board.attachments.url = `${this.fileService.getDownloadUrl(
          'board',
          fileName,
        )}?originalName=${originalName}`;
      }

      return board;
    });

    return nextBoards;
  }

  /**
   * 게시물 목록 조회 by created_by
   * @param created_by 생성자 ObjectId
   * @param page 페이지
   * @returns 게시물 목록
   */
  async getBoardListByCreatedBy(created_by: Types.ObjectId, page: number) {
    const boards = await this.boardModel.aggregate([
      {
        $match: {
          created_by: new mongoose.Types.ObjectId(created_by),
          is_activate: true,
        },
      },
      {
        $skip: page * BOARD_BLOCK_SIZE,
      },
      {
        $limit: BOARD_BLOCK_SIZE,
      },
      {
        $sort: {
          created_by: -1,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$created_by',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: 'created_by',
        },
      },
      { $unwind: '$created_by' },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$updated_by',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: 'updated_by',
        },
      },
      { $unwind: '$updated_by' },
    ]);

    const nextBoards = boards?.map((board) => {
      if (board && board?.attachments) {
        const {
          attachments: { fileName, originalName },
        } = board;

        board.attachments.url = `${this.fileService.getDownloadUrl(
          'board',
          fileName,
        )}?originalName=${originalName}`;
      }

      return board;
    });

    return nextBoards;
  }

  /**
   * 게시물 생성
   * @param userId 사용자 ObjectId
   * @param createBoardDto 게시물 생성 데이터
   * @returns 게시물
   */
  async createBoard(
    userId: Types.ObjectId,
    createBoardDto: CreateBoardDto,
    attachments: Attachments,
  ) {
    const board = new this.boardModel({
      ...createBoardDto,
      attachments,
      created_by: userId,
      updated_by: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await board.save();

    return await this.getBoard(board._id);
  }

  /**
   * 게시물 수정
   * @param _id 게시물 ObjectId
   * @param updated_by 수정자
   * @param updateBoardDto 게시물 수정 데이터
   * @param attachments 첨부파일
   */
  async updateBoard(
    _id: Types.ObjectId,
    updated_by: Types.ObjectId,
    updateBoardDto: UpdateBoardDto,
    attachments: Attachments,
  ) {
    const board = await this.boardModel
      .findOne({
        _id: new mongoose.Types.ObjectId(_id),
      })
      .lean();

    const nextBoard: any = {
      ...board,
      title: updateBoardDto.title,
      content: updateBoardDto.content,
      updated_by,
      updated_at: new Date(),
    };

    if (attachments) nextBoard.attachments = attachments;
    else if (!updateBoardDto?.attachments) nextBoard.attachments = null;

    return await this.boardModel.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      nextBoard,
    );
  }

  /**
   * 게시물 삭제
   * @param _id ObjectId
   * @returns 게시물
   */
  async deleteBoard(_id: Types.ObjectId, updated_by: Types.ObjectId) {
    return await this.boardModel.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      {
        is_activate: false,
        updated_by: updated_by,
        updated_at: new Date(),
      },
    );
  }

  /**
   * 게시물 갯수 조회
   * @param created_by 생성자 ObjectId
   * @returns 게시물 갯수
   */
  async countBoard() {
    return await this.boardModel
      .find({
        is_activate: true,
      })
      .countDocuments();
  }

  /**
   * 게시물 갯수 조회 by created_by
   * @param created_by 생성자 ObjectId
   * @returns 게시물 갯수
   */
  async countBoardByCreatedBy(created_by: Types.ObjectId) {
    return await this.boardModel
      .find({
        created_by: new mongoose.Types.ObjectId(created_by),
        is_activate: true,
      })
      .countDocuments();
  }
}
