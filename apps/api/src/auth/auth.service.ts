import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwt: JwtService) {}

  async validate(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).lean();
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException();
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validate(username, password);
    return { accessToken: this.jwt.sign({ sub: user._id, role: user.role }) };
  }
}
