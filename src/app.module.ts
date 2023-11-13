import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/error-handling/exception.filter';
import { ErrorLogger } from './utils/logger/logger.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './projects/project.module';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, ProjectModule, TaskModule],
  controllers: [AppController],
  providers: [
    AppService,
    ErrorLogger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
