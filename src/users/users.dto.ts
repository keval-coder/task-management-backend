import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Username is required.',
  })
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Password is required.',
  })
  @IsString()
  password: string;
}
