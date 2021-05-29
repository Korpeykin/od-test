import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import GetTagDto from './dto/getTag';
import PostTagDto from './dto/postTag';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(
    private tagsService: TagsService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('post-tag')
  async postTags(@Request() req, @Body() data: PostTagDto) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.postTag(data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-tag/:id')
  async getTags(@Param() data: GetTagDto, @Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.getTag(data.id);
  }
}
