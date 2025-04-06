import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CredentialAuthDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return await this.authService.register(registerAuthDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() credentialAuthDto: CredentialAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.login(credentialAuthDto);

    response.cookie('token', data.refreshtoken, {
      httpOnly: true,
      secure: this.configService.get('environment.production'),
      sameSite: this.configService.get('environment.production')
        ? 'strict'
        : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accesstoken: data.accessToken,
      user: data.user,
    };
  }

  @Get('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['token'] as string;
    return await this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['token'] as string;
    await this.authService.logout(refreshToken);
    res.clearCookie('token');
    res.sendStatus(204);
  }

  @Get('check')
  @HttpCode(200)
  async check(@Req() req: Request) {
    const refreshToken = req.cookies['token'] as string;
    return await this.authService.refresh(refreshToken);
  }
}
