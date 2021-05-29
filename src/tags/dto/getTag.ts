import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export default class GetTagDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id: number;
}
