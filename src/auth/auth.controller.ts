import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import RefreshAccessDto from './dto/refresh.dto';
import { ExtractJwt } from 'passport-jwt';
import SignInDto from './dto/signin.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return req.user;
  }

  @Post('refresh-access')
  async refreshAccessToken(@Body() data: RefreshAccessDto) {
    return this.authService.refresh(data);
  }

  @Post('signin')
  async signin(@Body() data: SignInDto) {
    return this.authService.signin(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    this.authService.logout(req.user, token);
    return;
  }
}
