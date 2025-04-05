import { IsEmail, MinLength, IsString, Matches } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
    message: 'Please enter a valid password',
  })
  password: string;
}
