import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty()
  currentPassword!: string;

  @IsNotEmpty()
  @MinLength(4)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{4,}$/, {
    message: 'The password should match with min 4 characters, 1 Uppercase, 1 Number.',
  })
  newPassword!: string;
}