import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Todo, TodoSchema } from './todo.schema';

@Schema({ collection: `categories` })
export class Category extends Document {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = HydratedDocument<Category>;

// todo: format codes
// todo: block comment for all controllers methods
