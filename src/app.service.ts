import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorLogger } from './utils/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly errorLogger: ErrorLogger) {}

  getHello() {
    try {
      // const value = null;
      // console.log(value['message']);
      throw new BadRequestException('Error avi gay');
      return 'message';
    } catch (error) {
      this.errorLogger.error(error.message, '/Get');
      throw new BadRequestException(error.message);
    }
  }
}
