import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './controllers/category.controller';
import { TodoController } from './controllers/todo.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { Todo, TodoSchema } from './schemas/todo.schema';

import { TodoService } from './services/todo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Todo.name, schema: TodoSchema },
    ]),
  ],
  controllers: [CategoryController, TodoController],
  providers: [TodoService],
})
export class TodoModule {}
