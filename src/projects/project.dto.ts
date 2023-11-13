import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Project name is required.',
  })
  @IsString()
  project_name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Description is required.',
  })
  @IsString()
  description: string;
}

export class ProjectPaginationDto {
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

export class UpdateProjectDto extends CreateProjectDto {}
