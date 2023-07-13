import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const CookieGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies[data];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    return token;
  },
);
