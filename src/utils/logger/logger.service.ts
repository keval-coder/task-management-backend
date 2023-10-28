import { BadRequestException, Injectable, LoggerService } from '@nestjs/common';
import { readFileSync, writeFile } from 'fs';
import { join } from 'path';

@Injectable()
export class ErrorLogger implements LoggerService {
  log(message: string) {
    console.log(
      `\x1b[32m[NEST] ${Date.now()} - ${new Date().toISOString()} : ${message} \x1b[0m`,
    );
  }

  error(message: string, trace: string) {
    this.writeToFile('❌ ' + message);
    this.writeToFile('🔍 Stack Trace: ' + trace);
  }

  warn(message: string) {
    this.writeToFile('⚠️ ' + message);
  }

  debug(message: string) {
    this.writeToFile('🐞 ' + message);
  }

  private writeToFile(message: string) {
    const filePath = join(process.cwd(), 'logs/error.log.json');
    const newData = {
      message,
      timestamp: new Date().toISOString(),
    };
    const data = readFileSync(filePath).toString();

    const parsedData = data.includes('[') ? JSON.parse(data) : data;
    const finalData =
      parsedData && parsedData.length ? [...parsedData, newData] : [newData];

    writeFile(filePath, JSON.stringify(finalData), (err) => {
      if (err) {
        throw new BadRequestException(err.message);
      }
    });
  }
}
