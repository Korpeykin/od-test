import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import PostTagDto from './dto/postTag';
import PostTagResponse from './interfaces/postTagResponse';

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

  async getTag(id: number) {
    const data = await this.dbService.getTag(id);
    return data;
  }
}
