import { User } from 'modules/user/schemas/user.schema';

export class JWTTokenDTO {
  userName: string;
  email: string;
  sub: string;
  iat?: number;
  exp?: number;

  constructor(data: User) {
    this.userName = data?.userName ?? '';
    this.email = data?.email ?? '',
    this.sub = data._id?.toString() ?? null;
  }
}