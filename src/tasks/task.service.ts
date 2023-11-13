import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../database/schemas/task.schema';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import {
  CreateTaskDto,
  TaskPaginationDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './task.dto';
import { Project, ProjectDocument } from '../database/schemas/project.schema';
import { TASK_STATUS } from '../utils/enums/database/task.enum';
import * as moment from 'moment';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { task_name, projectId, description } = createTaskDto;

    const validProject = await this.projectModel.findById(projectId);
    if (!validProject) throw new BadRequestException('Project is not valid.');

    const taskExist = await this.taskModel.findOne({
      task_name,
      project: validProject._id,
    });
    if (taskExist) throw new BadRequestException('Task name is already used.');

    try {
      await this.taskModel.create({
        task_name,
        description,
        project: validProject._id,
        status: TASK_STATUS.pending,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return 'Task created successfully.';
  }

  async findAllProjectTask(
    projectId: string,
    taskPaginationDto: TaskPaginationDto,
  ) {
    const { page, limit, search } = taskPaginationDto;

    const validProject = await this.projectModel.findById(projectId);
    if (!validProject) throw new BadRequestException('Project is not valid.');

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

    const skip = (Number(page) - 1) * Number(limit);
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

    const tasks = await this.taskModel.aggregate(pipeline);

    return {
      tasks,
    };
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto) {
    const { task_name, description } = updateTaskDto;

    const validTask = await this.taskModel.findById(taskId);
    if (!validTask) throw new BadRequestException('Task is not valid.');

    const taskExist = await this.taskModel.findOne({
      task_name,
      project: validTask.project,
      _id: { $ne: validTask._id },
    });
    if (taskExist) throw new BadRequestException('Task name is already used.');

    try {
      await this.taskModel.findByIdAndUpdate(taskId, {
        $set: {
          task_name,
          description,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return 'Task updated successfully.';
  }

  async updateStatus(taskId: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    const validTask = await this.taskModel.findById(taskId);
    if (!validTask) throw new BadRequestException('Task is not valid.');

    const { status } = updateTaskStatusDto;
    try {
      if (status === TASK_STATUS.pending || status === TASK_STATUS.completed) {
        const startingDate = moment(validTask.starting_date);
        const currDate = moment();

        const diff = currDate.diff(startingDate, 'h');
        const totalHours = Number(diff) + Number(validTask?.total_hours || 0);

        await this.taskModel.findByIdAndUpdate(taskId, {
          $set: {
            status,
            total_hours: totalHours,
          },
          $unset: {
            starting_date: null,
          },
        });

        if (status === TASK_STATUS.completed) {
          await this.projectModel.findByIdAndUpdate(validTask.project, {
            $set: {
              total_hours: totalHours,
            },
          });
        }
      } else if (status === TASK_STATUS.on_going) {
        await this.taskModel.findByIdAndUpdate(taskId, {
          $set: {
            starting_date: moment(),
            status,
          },
        });
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return 'Task status updated successfully.';
  }
}
