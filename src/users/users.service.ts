import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    const userExist = await this.userModel.findOne({
      username,
    });
    if (userExist) throw new BadRequestException('User is already exist.');

    const saltOrRounds = 10;
    const hashPass = await bcrypt.hash(password, saltOrRounds);

    try {
      await this.userModel.create({
        username,
        password: hashPass,
        status: true,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return 'User register successfully.';
  }

  async findOneUser(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      username,
    });
    if (!user) throw new NotFoundException('User is not found!');

    console.log(user);

    return user;
  }
}
