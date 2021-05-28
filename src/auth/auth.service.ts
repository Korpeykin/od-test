import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import RefreshAccessDto from './dto/refresh.dto';
import RefreshToken from './interfaces/refresh.cache';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(username: string, pass?: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.sAMAccountName, sub: user.employeeID };
    return {
      user: {
        id: user.employeeID,
        username: user.sAMAccountName,
        displayName: user.displayName,
        mail: user.mail,
      },
      refresh_token: await this.generateRefresh(user.sAMAccountName),
      access_token: this.jwtService.sign(payload),
    };
  }

  async refresh(data: RefreshAccessDto) {
    const refresKeyString: string = await this.cacheManager.get(data.username);
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
    const payload = { username: data.username, sub: data.userId };
    return {
      refresh_token: await this.generateRefresh(
        data.username,
        data.refresh_token,
      ),
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
}
