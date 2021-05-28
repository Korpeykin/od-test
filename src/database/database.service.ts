import { Inject, Injectable } from '@nestjs/common';
import { Users } from './pg/users.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('PG_USERS_REPOSITORY')
    private pgUsers: typeof Users,
  ) {}

  toSeconds(n: number) {
    return n / 1000;
  }
}
