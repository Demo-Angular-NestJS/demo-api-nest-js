import { IsEmail, IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  password: string;
}
