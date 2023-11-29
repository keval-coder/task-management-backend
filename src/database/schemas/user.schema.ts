import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  refresh_token: string;

  @Prop()
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
