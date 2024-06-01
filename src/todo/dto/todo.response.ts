// todo : format imports by origin
import { ApiProperty } from '@nestjs/swagger';

import { Todo } from '../schemas/todo.schema';
import { Category } from './../schemas/category.schema';
import { CategoryResponseDto } from './category.response';

export class TodoResponseDto {
  static response({ _id, title, description, priority }: Todo) {
    return {
      id: _id.toHexString(),
      title,
      description,
      priority,
    };
  }

  @ApiProperty({
    description: 'ID of the todo.',
    example: '665847c6b8928a862377f267',
  })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  priority: number;
}

export class TodoListResponseDto {
  static response(category: Category, todos: Todo[]) {
    const categoryResponse = CategoryResponseDto.response(category);
    const todoList = todos.map((todo) => TodoResponseDto.response(todo));
    return {
      category: categoryResponse,
      todoList,
    };
  }

  @ApiProperty()
  category: CategoryResponseDto;

  @ApiProperty({ type: [TodoResponseDto] })
  todoList: TodoResponseDto[];
}
