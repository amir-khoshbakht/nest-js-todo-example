import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryRequestDto } from '../dto/category.request.dto';
import { CategoryResponseDto } from '../dto/category.response';
import { TodoRequestDto } from '../dto/todo.request.dto';
import { TodoListResponseDto, TodoResponseDto } from '../dto/todo.response';
import { Category } from '../schemas/category.schema';
import { Todo } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private todoModel: Model<Todo>,
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async createCategory(userId: string, requestDto: CategoryRequestDto) {
    await this.categoryModel.create({ ...requestDto, user: userId });
  }

  async getCategories(userId: string) {
    const categories = await this.categoryModel.find({ user: userId }).lean();

    return categories.map((category) => CategoryResponseDto.response(category));
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    requestDto: CategoryRequestDto,
  ) {
    const category = await this.findUserCategory(categoryId, userId);
    category.title = requestDto.title;
    await category.save();
    return CategoryResponseDto.response(category);
  }

  private async findUserCategory(categoryId: string, userId: string) {
    const category = await this.categoryModel.findById(categoryId);

    if (!category) throw new NotFoundException('category not found!');

    const ownerUserId = category.user.toHexString();
    if (ownerUserId != userId)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    return category;
  }

  async createTodo(
    userId: string,
    categoryId: string,
    requestDto: TodoRequestDto,
  ) {
    await this.todoModel.create({
      ...requestDto,
      category: categoryId,
      user: userId,
    });
  }

  async getTodos(categoryId: string, userId: string) {
    const category = await this.findUserCategory(categoryId, userId);

    const todos = await this.todoModel
      .find({ category: categoryId })
      .sort({ priority: 1 })
      .lean();
    return TodoListResponseDto.response(category, todos);
  }

  async updateTodo(userId: string, todoId: string, requestDto: TodoRequestDto) {
    const todo = await this.todoModel.findById(todoId);
    const categoryId = todo.category.toHexString();

    await this.findUserCategory(categoryId, userId);

    todo.title = requestDto.title;
    todo.description = requestDto.description;
    todo.priority = requestDto.priority;
    await todo.save();
    return TodoResponseDto.response(todo);
  }
}
