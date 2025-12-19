import { Request } from 'express';
import { JwtPayload } from '../tokens/token.types';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
