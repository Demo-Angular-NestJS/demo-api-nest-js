import { Request } from 'express';
import { JWTTokenDTO } from './jwt-token.dto';

export interface AuthenticatedRequestModel extends Request {
  user: JWTTokenDTO;
}