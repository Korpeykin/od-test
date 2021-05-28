import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type User = any;
@Injectable()
export class UsersService {
  private readonly ad: any;

  constructor(private configService: ConfigService) {
    const ActiveDirectory = require('activedirectory2');
    this.ad = new ActiveDirectory({
      url: this.configService.get<string>('LDAP_URL'),
      baseDN: this.configService.get<string>('BASE_DN'),
      username: this.configService.get<string>('LDAP_USERNAME'),
      password: this.configService.get<string>('LDAP_PASS'),
    });
  }

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
