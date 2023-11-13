import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateProjectDto,
  ProjectPaginationDto,
  UpdateProjectDto,
} from './project.dto';

@Controller('api/project')
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    console.log(createProjectDto, '**');

    return await this.projectService.createProject(createProjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  async findAllProjects(@Query() projectPaginationDto: ProjectPaginationDto) {
    return await this.projectService.findAllProject(projectPaginationDto);
  }

  @Put(':projectId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.updateProject(projectId, updateProjectDto);
  }

  @Patch(':projectId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  async updateProjectStatus(@Param('projectId') projectId: string) {
    return await this.projectService.updateProjectStatus(projectId);
  }
}
