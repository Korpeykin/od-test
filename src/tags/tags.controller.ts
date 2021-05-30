import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Param,
  Query,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import GetTagDto from './dto/getTag';
import GetTagsDto from './dto/getTags';
import PostTagDto from './dto/postTag';
import PostUserTagsDto from './dto/postUserTags';
import PutTagDto from './dto/putTag';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(
    private tagsService: TagsService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('post-tag')
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
  @Put('put-tag/:id')
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
  @Delete('delete-tag/:id')
  async deleteTag(@Param() param: GetTagDto, @Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.deleteTag(req.user.userId, param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/tag')
  async postUserTag(@Body() body: PostUserTagsDto, @Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.postUserTag(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/tag/:id')
  async deleteUserTag(@Param() param: GetTagDto, @Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.deleteUserTag(param.id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/tag/my')
  async getUserTagMy(@Request() req) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.authService.authJwt(token);
    return this.tagsService.getUserTagMy(req.user.userId);
  }
}
