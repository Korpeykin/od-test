import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type User = any;
@Injectable()
export class UsersService {
  private readonly ad: any;

  constructor(private configService: ConfigService) {}

  findOne(username: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.ad.findUser(username, function (err, user) {
        if (err) {
          reject(err);
        }
        if (!user) {
          console.log('User: ' + username + ' not found.');
          resolve(null);
          return;
        } else {
          resolve(user);
        }
      });
    });
  }
}
