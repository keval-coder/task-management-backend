import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TASK_STATUS } from '../../utils/enums/database/task.enum';
import { Project } from './project.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ collection: 'task' })
export class Task {
  @Prop()
  task_name: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Project.name })
  project: Project;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(TASK_STATUS),
  })
  status: string;

  @Prop()
  starting_date: Date;

  @Prop()
  total_hours: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
