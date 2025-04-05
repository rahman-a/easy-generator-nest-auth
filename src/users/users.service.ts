import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usermodel: Model<User>,
  ) {}
  async findOne(id: string) {
    const user = await this.usermodel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const { _id, name, email } = user;
    return {
      _id,
      name,
      email,
    };
  }
}
