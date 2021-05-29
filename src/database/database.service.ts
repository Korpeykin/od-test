import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import SignInDto from 'src/auth/dto/signin.dto';
import { Users } from './pg/users.entity';
import { ConfigService } from '@nestjs/config';
import IUser from 'src/auth/interfaces/user';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('PG_USERS_REPOSITORY')
    private pgUsers: typeof Users,
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
}
