import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '../database/schemas/project.schema';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import {
  CreateProjectDto,
  ProjectPaginationDto,
  UpdateProjectDto,
} from './project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    const { project_name, description } = createProjectDto;

    const projectExist = await this.projectModel.findOne({
      name: project_name,
    });
    if (projectExist)
      throw new BadRequestException('Project name is already exist.');

    try {
      await this.projectModel.create({
        name: project_name,
        description,
        status: true,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return 'Project created successfully.';
  }

  async findAllProject(projectPaginationDto: ProjectPaginationDto) {
    const { page, limit, search } = projectPaginationDto;
    const skip = (Number(page) - 1) * Number(limit);

    const matchQuery: FilterQuery<any> = {};
    if (search) {
      matchQuery.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const pipeline: PipelineStage[] = [
      {
        $match: matchQuery,
      },
      {
        $skip: skip,
      },
      {
        $limit: Number(limit),
      },
    ];

    const projects = await this.projectModel.aggregate(pipeline);

    return {
      projects,
    };
  }

  async updateProject(projectId: string, updateProjectDto: UpdateProjectDto) {
    const { project_name, description } = updateProjectDto;

    const validProject = await this.projectModel.findById(projectId);
    if (!validProject) throw new BadRequestException('Project is not valid.');

    const projectExist = await this.projectModel.findOne({
      name: project_name,
      _id: { $ne: validProject._id },
    });
    if (projectExist)
      throw new BadRequestException('Project is already exist.');

    try {
      await this.projectModel
        .findByIdAndUpdate(validProject._id, {
          $set: {
            name: project_name,
            description,
          },
        })
        .exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return 'Project updated successfully.';
  }

  async updateProjectStatus(projectId: string) {
    const validProject = await this.projectModel.findById(projectId);
    if (!validProject) throw new BadRequestException('Project is not valid.');

    const { status } = validProject;

    try {
      await this.projectModel
        .findByIdAndUpdate(validProject._id, {
          $set: {
            status: !status,
          },
        })
        .exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return 'Project status is updated successfully.';
  }
}
