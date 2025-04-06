import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  user: {
    _id: string;
    email: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    if (!bearerToken?.startsWith('Bearer')) {
      throw new ForbiddenException('invalid token');
    }
    const token = bearerToken.split(' ')[1];
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      request.user = payload.user;
    } catch (error: unknown) {
      Logger.error(error);
      throw new ForbiddenException('invalid token');
    }
    return true;
  }
}
