import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export default class GetTagsDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  offset: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  length: number;

  @IsOptional()
  sortByOrder: undefined;

  @IsOptional()
  sortByName: undefined;
}
