import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TASK_STATUS } from '../utils/enums/database/task.enum';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Project is required.',
  })
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Task name is required',
  })
  @IsString()
  task_name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Description is required.',
  })
  @IsString()
  description: string;
}

export class TaskPaginationDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Page is nor required.',
  })
  @Transform((page) => Number(page))
  page: number;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Page is nor required.',
  })
  @Transform((limit) => Number(limit))
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  search: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Task name is required',
  })
  @IsString()
  task_name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Description is required.',
  })
  @IsString()
  description: string;
}

export class UpdateTaskStatusDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Task status is required.',
  })
  @IsEnum(TASK_STATUS)
  status: TASK_STATUS;
}
