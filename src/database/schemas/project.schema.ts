import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'projects' })
export class Project {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  status: boolean;

  @Prop()
  total_hours: number;

  @Prop()
  completed_date: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
