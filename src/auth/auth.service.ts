import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import RefreshAccessDto from './dto/refresh.dto';
import RefreshToken from './interfaces/refresh.cache';
import SignInDto from './dto/signin.dto';
import SignInLoginResponse from './interfaces/signinLogin.response';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import IUser from './interfaces/user';
import JwtBlackList from './interfaces/jwtBlackList';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  // private _jwtBlackList: JwtBlackList[] = [];
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.cacheManager.set(jwtConstants.blackListName, JSON.stringify([]), {
      ttl: this.config.get<number>('JWT_EXPIRATION_TIME') * 2,
    });
    setInterval(async () => {
      const blackList: JwtBlackList[] = JSON.parse(
        await this.cacheManager.get(jwtConstants.blackListName),
      );
      blackList.forEach((row, index) => {
        if (
          Date.now() >
          row.timestamp + this.config.get<number>('JWT_EXPIRATION_TIME')
        ) {
          blackList.splice(index, 1);
        }
      });
    }, this.config.get<number>('JWT_EXPIRATION_TIME'));
  }

  async authJwt(token: string) {
    const blackList: JwtBlackList[] = JSON.parse(
      await this.cacheManager.get(jwtConstants.blackListName),
    );
    if (blackList.find((row) => row.token === token)) {
      throw new UnauthorizedException();
    }
  }

  async validateUser(email: string, pass: string): Promise<IUser> {
    const user = await this.databaseService.login(email);
    if (!user) {
      return null;
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      return null;
    }
    delete user.password;
    return user;
  }

  async login(user: IUser) {
    const payload = { username: user.email, sub: user.uid };
    return {
      refresh_token: await this.generateRefresh(user.email),
      token: this.jwtService.sign(payload),
      expire: this.config.get<number>('JWT_EXPIRATION_TIME'),
    };
  }

  async refresh(data: RefreshAccessDto) {
    const refresKeyString: string = await this.cacheManager.get(data.email);
    if (!refresKeyString) {
      throw new UnauthorizedException();
    }
    const refresKey: RefreshToken[] = JSON.parse(refresKeyString);
    const ok = refresKey.find(
      (tokenObj) => tokenObj.token === data.refresh_token,
    );
    if (!ok) {
      throw new UnauthorizedException();
    }
    const payload = { username: data.email, sub: data.uid };
    return {
      refresh_token: await this.generateRefresh(data.email, data.refresh_token),
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateRefresh(
    username: string,
    token?: string,
    ttl?: number,
  ): Promise<string> {
    const refresh_token = uuidv4();
    if (!ttl) {
      ttl = 1000 * 60 * 60 * 24;
    }
    const tokensStr = await this.cacheManager.get(username);
    let tokensArr: RefreshToken[];
    if (typeof tokensStr === 'string') {
      tokensArr = JSON.parse(tokensStr);
      if (token) {
        const delInd = tokensArr.findIndex(
          (thisToken) => thisToken.token === token,
        );
        if (delInd !== -1) {
          tokensArr.splice(delInd, 1);
        }
      }
      tokensArr.sort(function (a, b) {
        if (a.timestamp > b.timestamp) {
          return 1;
        }
        if (a.timestamp < b.timestamp) {
          return -1;
        }
        return 0;
      });
      if (tokensArr.length - 1 > 5) {
        tokensArr.splice(0, 1);
      }
    } else {
      tokensArr = [];
    }
    tokensArr.push({
      token: refresh_token,
      timestamp: Date.now(),
    });
    await this.cacheManager.set(username, JSON.stringify(tokensArr), {
      ttl,
    });

    return refresh_token;
  }

  async logout(user, token: string) {
    const blackList: JwtBlackList[] = JSON.parse(
      await this.cacheManager.get<string>(jwtConstants.blackListName),
    );
    const pass = blackList.find((row) => row.token === token);
    if (!pass) {
      blackList.push({
        token,
        timestamp: Date.now(),
      });
      await this.cacheManager.set(
        jwtConstants.blackListName,
        JSON.stringify(blackList),
        {
          ttl: this.config.get<number>('JWT_EXPIRATION_TIME') * 2,
        },
      );
    }
    await this.cacheManager.del(user.username);
  }

  async signin(data: SignInDto): Promise<SignInLoginResponse> {
    const user = await this.databaseService.signin(data);
    const payload = { username: user.email, sub: user.uid };
    return {
      token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefresh(user.email),
      expire: this.config.get<number>('JWT_EXPIRATION_TIME'),
    };
  }
}
