import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
} from 'class-validator';

export default class RefreshAccessDto {
  @IsNotEmpty()
  @IsUUID(4)
  refresh_token: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsNumberString()
  userId: number;
}
