import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export default class PostTagDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  name: string;

  @IsOptional()
  @IsNumberString()
  sortOrder?: string;
}
