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
import { Op } from 'sequelize';
import { UserTags } from './pg/user-tag.entity';
import UserTagInsert from './interfaces/userTagInsert';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('PG_USERS_REPOSITORY')
    private pgUsers: typeof Users,

    @Inject('PG_TAG_REPOSITORY')
    private pgTags: typeof Tag,

    @Inject('PG_USER_TAG_REPOSITORY')
    private pgUserTags: typeof UserTags,

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
  async putUser(uid: string) {
    const user = await this.pgUsers.findOne({
      where: {
        uid,
      },
    });
    return user;
  }

  async checkUserDublicate(email: string, nickname: string) {
    return await this.pgUsers.findAll({
      where: { [Op.or]: [{ email }, { nickname }] },
    });
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
    const objKeys = Object.keys(data);
    if (objKeys.includes('sortByName')) {
      order.push(['name', 'DESC']);
    }
    if (objKeys.includes('sortByOrder')) {
      order.push(['id', 'DESC']);
    }
    return await this.pgTags.findAndCountAll({
      include: { model: Users, attributes: ['uid', 'nickname'] },
      // attributes: ['name', 'sortOrder'],
      offset: data.offset ? data.offset : undefined,
      limit: data.length ? data.length : undefined,
      order: order.length !== 0 ? order : undefined,
    });
  }

  async getAllTagsFromArray(arr: number[]) {
    return await this.pgTags.findAll({
      where: {
        id: {
          [Op.in]: arr,
        },
      },
    });
  }

  async bulkUserTagsCreate(data: UserTagInsert[]) {
    return await this.pgUserTags.bulkCreate(data, {
      include: {
        model: Tag,
        as: 'tag',
        attributes: ['id', 'name', 'sortOrder'],
      },
    });
  }

  async getAllUsersTagsFromUserTags(uid: string) {
    return await this.pgUserTags.findAll({
      include: {
        model: Tag,
        attributes: ['id', 'name', 'sortOrder'],
      },
      where: {
        userId: uid,
      },
    });
  }

  async getMyTags(uid: string) {
    return await this.pgTags.findAll({
      where: {
        creator: uid,
      },
    });
  }
}
