import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import SignInDto from 'src/auth/dto/signin.dto';
import { Users } from './pg/users.entity';
import { ConfigService } from '@nestjs/config';
import IUser from 'src/auth/interfaces/user';
import { Tag } from './pg/tag.entity';
import PostTagDto from 'src/tags/dto/postTag';
import InsertTag from './interfaces/insertTag';
import QueryTags from './interfaces/queryTags';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('PG_USERS_REPOSITORY')
    private pgUsers: typeof Users,
    @Inject('PG_TAG_REPOSITORY')
    private pgTags: typeof Tag,
    private config: ConfigService,
  ) {}

  toSeconds(n: number) {
    return n / 1000;
  }

  async signin(data: SignInDto): Promise<Users> {
    try {
      const user = new this.pgUsers({
        uid: uuidv4(),
        email: data.email,
        password: await bcrypt.hash(
          data.password,
          Number(this.config.get<number>('SALT_ROUNDS')),
        ),
        nickname: data.nickname,
      });
      return await user.save();
    } catch (error) {
      throw new BadRequestException(`Dublicate ${error.original.constraint}`);
    }
  }

  async login(email: string): Promise<IUser> {
    return await this.pgUsers.findOne({
      raw: true,
      where: {
        email,
      },
    });
  }

  async getUser(uid: string) {
    const user = await this.pgUsers.findOne({
      include: { model: Tag, attributes: ['id', 'name', 'sortOrder'] },
      where: {
        uid,
      },
    });
    return user;
  }

  async deleteUser(uid: string) {
    return await this.pgUsers.destroy({
      where: {
        uid,
      },
      cascade: false,
    });
  }

  async createTag(data: PostTagDto, uid: string) {
    const insertObj: InsertTag = {
      name: data.name,
      creator: uid,
    };
    if (data.sortOrder) {
      insertObj.sortOrder = data.sortOrder;
    }
    try {
      const tag = new this.pgTags(insertObj);
      return await tag.save();
    } catch (error) {
      throw new BadRequestException(`Dublicate ${error.original.constraint}`);
    }
  }

  async getTag(id: number) {
    return await this.pgTags.findOne({
      include: { model: Users, attributes: ['uid', 'nickname'] },
      where: {
        id,
      },
    });
  }

  async getTags(data: QueryTags) {
    const order = [];
    if (data.sortByName) {
      order.push(['name', 'DESC']);
    }
    if (data.sortByOrder) {
      order.push(['id', 'DESC']);
    }
    return await this.pgTags.findAndCountAll({
      include: { model: Users, attributes: ['uid', 'nickname'] },
      attributes: ['name', 'sortOrder'],
      offset: data.offset ? data.offset : undefined,
      limit: data.length ? data.length : undefined,
      order: order.length !== 0 ? order : undefined,
    });
  }
}
