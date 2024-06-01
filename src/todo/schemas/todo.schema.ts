import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';

@Schema({ collection: `todos` })
export class Todo extends Document {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
  })
  category: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: false, default: 0 })
  priority: number;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
TodoSchema.index({ priority: 1 });
export type TodoDocument = HydratedDocument<Todo>;
