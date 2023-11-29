import {
  Body,
  Controller,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../utils/decorators/user.decorator';
import { LoginUserT } from '../utils/types/auth.type';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Put('refresh-token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async refereshToken(@User() user: LoginUserT) {
    return await this.authService.refereshToken(user);
  }
}
