import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import UserJwt from './interfaces/userJwt';
import { GetUser } from './interfaces/getUser';
import PutUserDto from './dto/putUser.dto';
import PutUserResponse from './interfaces/putUserResponse';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  constructor(
    private dbService: DatabaseService,
    private config: ConfigService,
  ) {}

  async getUser(user: UserJwt): Promise<GetUser> {
    const data = await this.dbService.getUser(user.userId);
    return {
      email: data.email,
      nickname: data.nickname,
      tags: data.tags,
    };
  }

  async putUser(data: PutUserDto, uid: string): Promise<PutUserResponse> {
    const checkDublicate = await this.dbService.checkUserDublicate(
      data.email,
      data.nickname,
    );
    if (checkDublicate.length !== 0) {
      throw new BadRequestException(`Dublicate email or nickname!`);
    }
    const user = await this.dbService.putUser(uid);
    if (data.email) {
      user.email = data.email;
    }
    if (data.nickname) {
      user.nickname = data.nickname;
    }
    if (data.password) {
      user.password = await bcrypt.hash(
        data.password,
        Number(this.config.get<number>('SALT_ROUNDS')),
      );
    }

    await user.save();

    return {
      email: user.email,
      nickname: user.nickname,
    };
  }

  async deleteUser(uid: string) {
    await this.dbService.deleteUser(uid);
  }
}
