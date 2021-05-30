import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import PostTagDto from './dto/postTag';
import GetTagsDto from './dto/getTags';
import GetTagResponse from './interfaces/getTagResponse';
import PostTagResponse from './interfaces/postTagResponse';
import GetTagsResponse from './interfaces/getTagsResponse';
import PutTagDto from './dto/putTag';
import PostUserTagsDto from './dto/postUserTags';
import UserTagInsert from '../database/interfaces/userTagInsert';
import PostUserTags from './interfaces/postUserTags';

@Injectable()
export class TagsService {
  constructor(private dbService: DatabaseService) {}

  async postTag(body: PostTagDto, uid: string): Promise<PostTagResponse> {
    const data = await this.dbService.createTag(body, uid);
    return {
      id: data.id,
      name: data.name,
      sortOrder: data.sortOrder,
    };
  }

  async getTag(id: number): Promise<GetTagResponse> {
    const data = await this.dbService.getTag(id);
    return {
      creator: {
        nickname: data.user.nickname,
        uid: data.user.uid,
      },
      name: data.name,
      sortOrder: data.sortOrder,
    };
  }

  async getTags(query: GetTagsDto): Promise<GetTagsResponse> {
    const res = await this.dbService.getTags(query);
    const data: GetTagsResponse = {
      data: [],
      meta: {
        quantity: res.count,
      },
    };
    if (query.offset) {
      data.meta['offset'] = query.offset;
    }
    if (query.length) {
      data.meta['length '] = query.length;
    }
    res.rows.forEach((row) => {
      data.data.push({
        creator: {
          nickname: row.user.nickname,
          uid: row.user.uid,
        },
        name: row.name,
        sortOrder: row.sortOrder,
      });
    });
    return data;
  }

  async putTag(
    userId: string,
    id: number,
    body: PutTagDto,
  ): Promise<GetTagResponse> {
    const tag = await this.dbService.getTag(id);
    if (tag.user.uid !== userId) {
      throw new BadRequestException("You are not this tag's owner!");
    }
    const response: GetTagResponse = {
      creator: {
        nickname: tag.user.nickname,
        uid: tag.user.uid,
      },
      name: tag.name,
      sortOrder: tag.sortOrder,
    };
    if (body.name) {
      tag.name = body.name;
    }
    if (body.sortOrder) {
      tag.sortOrder = body.sortOrder;
    }
    if (body.name || body.sortOrder) {
      await tag.save();
      response.name = tag.name;
      response.sortOrder = tag.sortOrder;
    }
    return response;
  }

  async deleteTag(userId: string, id: number) {
    const tag = await this.dbService.getTag(id);
    if (tag.user.uid !== userId) {
      throw new BadRequestException("You are not this tag's owner!");
    }
    tag.destroy();
    return;
  }

  async postUserTag(
    body: PostUserTagsDto,
    userId: string,
  ): Promise<PostUserTags> {
    const tags = await this.dbService.getAllTagsFromArray(body.tags);
    const dbQuery: UserTagInsert[] = [];
    body.tags.forEach((tagId) => {
      if (!tags.find((tag) => tagId === Number(tag.id))) {
        throw new BadRequestException(`Tag with id=${tagId} not exists`);
      }
      dbQuery.push({
        tagId,
        userId,
      });
    });
    const apiResponse: PostUserTags = {
      tags: [],
    };
    await this.dbService.bulkUserTagsCreate(dbQuery);
    tags.forEach((tag) => {
      apiResponse.tags.push({
        id: Number(tag.id),
        name: tag.name,
        sortOrder: tag.sortOrder,
      });
    });
    return apiResponse;
  }
}
