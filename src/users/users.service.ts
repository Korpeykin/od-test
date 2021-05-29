import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import UserJwt from './interfaces/userJwt';
import { GetUser } from './interfaces/getUser';
import PutUserDto from './dto/putUser.dto';
import PutUserResponse from './interfaces/putUserResponse';
@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private dbService: DatabaseService,
  ) {}

  async getUser(user: UserJwt): Promise<GetUser> {
    const data = await this.dbService.getUser(user.userId);
    return {
      email: data.email,
      nickname: data.nickname,
      tags: data.tags,
    };
  }

  async putUser(data: PutUserDto): Promise<PutUserResponse> {
    const user = await this.dbService.signin(data);
    return {
      email: user.email,
      nickname: user.nickname,
    };
  }

  async deleteUser(uid: string) {
    await this.dbService.deleteUser(uid);
  }
}
