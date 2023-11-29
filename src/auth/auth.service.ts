import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './auth.dto';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload, LoginUserT } from '../utils/types/auth.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userService.findOneUser(username);
    if (!user) throw new BadRequestException('Username is not valid.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Password is not valid.');

    const payload: JwtTokenPayload = {
      sub: String(user._id),
      username: user.username,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: {
        refresh_token: refreshToken,
      },
    });

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refresh_token: refreshToken,
      user: {
        username: user.username,
        status: user.status,
      },
    };
  }

  async refereshToken(user: LoginUserT) {
    const userExist = await this.userService.findOneUser(user.username);
    if (!userExist) throw new BadRequestException('Username is not valid.');

    const payload: JwtTokenPayload = {
      sub: String(userExist._id),
      username: user.username,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    await this.userModel.findByIdAndUpdate(userExist._id, {
      $set: {
        refresh_token: refreshToken,
      },
    });

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refresh_token: refreshToken,
    };
  }
}
