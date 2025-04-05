import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CredentialAuthDto } from './dto/login-auth.dto';
import { Model } from 'mongoose';
import { User } from './schema/auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schema/refresh-token.schema';
import { randomBytes } from 'node:crypto';
import { addDays, compareDesc } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModal: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly RefreshtokenModal: Model<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto) {
    const { email, password } = registerAuthDto;
    // TODO check if email exist
    const emainInUse = await this.userModal.findOne({
      email,
    });
    if (emainInUse) {
      throw new BadRequestException('Email already in use');
    }
    // TODO hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO save the user data
    await this.userModal.create({
      ...registerAuthDto,
      password: hashedPassword,
    });
    return registerAuthDto;
  }

  async login(credentialAuthDto: CredentialAuthDto) {
    const { email, password } = credentialAuthDto;
    // TODO check if email exist
    const user = await this.userModal.findOne({
      email,
    });

    if (!user) {
      throw new UnauthorizedException(
        'Unable to login, please check your credential',
      );
    }
    // TODO check is password match
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Unable to login, please check your credential',
      );
    }

    const refreshtoken = randomBytes(24).toString('hex');

    await this.RefreshtokenModal.updateOne(
      { userId: user._id },
      { $set: { expiryAt: addDays(new Date(), 7), token: refreshtoken } },
      {
        upsert: true,
      },
    );
    return {
      accessToken: this.generateAccessToken({
        _id: user?._id as string,
        email: user?.email,
      }),
      refreshtoken,
      user: {
        _id: user._id,
      },
    };
  }

  async refresh(refreshToken: string) {
    const token = await this.RefreshtokenModal.findOne({
      token: refreshToken,
    });
    if (!token) {
      throw new UnauthorizedException('invalid token');
    }
    const isValid = compareDesc(new Date(), token.expiryAt) === 1;
    if (!isValid) {
      await token.deleteOne();
      throw new UnauthorizedException('invalid token');
    }
    const user = await this.userModal.findById(token.userId);
    return {
      accessToken: this.generateAccessToken({
        _id: user?._id as string,
        email: user?.email as string,
      }),
    };
  }

  async logout(refreshtoken: string) {
    await this.RefreshtokenModal.findOneAndDelete({
      token: refreshtoken,
    });
  }

  generateAccessToken(user: { _id: string; email: string }) {
    return this.jwtService.sign({ user }, { expiresIn: 15 * 60 });
  }
}
