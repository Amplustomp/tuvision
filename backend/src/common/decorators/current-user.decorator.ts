import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    return data ? user[data] : user;
  },
);
