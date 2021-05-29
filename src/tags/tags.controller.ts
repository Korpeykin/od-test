import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import GetTagDto from './dto/getTag';
import GetTagsDto from './dto/getTags';
import PostTagDto from './dto/postTag';
import PutTagDto from './dto/putTag';
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
  async getTag(@Param() data: GetTagDto, @Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.getTag(data.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-tags')
  async getTags(@Query() data: GetTagsDto, @Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.getTags(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('put-tag/:id')
  async putTag(
    @Param() param: GetTagDto,
    @Body() body: PutTagDto,
    @Request() req,
  ) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.putTag(req.user.userId, param.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('delete-tag/:id')
  async deleteTag(@Param() param: GetTagDto, @Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.deleteTag(req.user.userId, param.id);
  }
}
