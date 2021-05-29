import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret(),
      },
      // (req, payload: any, done: VerifiedCallback) => {
      //   // const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      //   console.log(req);
      // },
    );
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
  // async authenticate(req) {
  //   const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  //   const ok = this.authService.authJwt(token);
  //   if (!ok) {
  //     throw new UnauthorizedException();
  //   }
  //   return ok;
  // }
}
