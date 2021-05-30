import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export default class RefreshAccessDto {
  @IsNotEmpty()
  @IsUUID(4)
  refresh_token: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  uid: string;
}
