import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
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
      throw new UnauthorizedException('Invalid token');
    }
    const token = bearerToken.split(' ')[1];
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      console.log({ payload });
      request.user = payload.user;
    } catch (error: unknown) {
      Logger.error(error);
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
