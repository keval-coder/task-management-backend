import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Task, TaskSchema } from './schemas/task.schema';

const collections = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Project.name, schema: ProjectSchema },
  { name: Task.name, schema: TaskSchema },
]);

const database = MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: 'mongodb://localhost:27017/task_management',
  }),
});

@Module({
  imports: [database, collections],
  exports: [database],
})
export class DatabaseModule {}
