import { Request } from 'express';

export interface AuthCookie {
  access_token?: string;
  refresh_token?: string;
  csrf_token?: string;
}

export interface AuthRequest extends Request {
  cookies: AuthCookie;
}
