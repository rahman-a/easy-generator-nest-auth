import { IsEmail, IsString } from 'class-validator';

export class CredentialAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
