import { IsArray } from 'class-validator';

export default class PostUserTagsDto {
  @IsArray()
  tags: number[];
}
