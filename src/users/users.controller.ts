import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Body,
  Delete,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import PutUserDto from './dto/putUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.usersService.getUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('put-user')
  async putUser(@Request() req, @Body() data: PutUserDto) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.usersService.putUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-user')
  async deleteUser(@Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    await this.authService.logout(req.user, token);
    return this.usersService.deleteUser(req.user.userId);
  }
}
