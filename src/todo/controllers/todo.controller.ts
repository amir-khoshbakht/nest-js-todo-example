import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CategoryIdDto } from '../dto/category-id.request.dto';
import { TodoRequestDto } from '../dto/todo.request.dto';
import { TodoService } from '../services/todo.service';
import { CategoryResponseDto } from '../dto/category.response';
import { TodoListResponseDto, TodoResponseDto } from '../dto/todo.response';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { JwtPayload } from '../../auth/jwt-payload.decorator';
import { JwtPayloadInterface } from '../../auth/jwt.strategy';
import { TodoIdDto } from '../dto/todo-id.request.dto';

@ApiTags('Todo - Todo')
@Controller('todo/todo')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: 'Create a todo' })
  @ApiCreatedResponse({ description: 'Todo created successfully.' })
  @Post(':categoryId')
  async create(
    @JwtPayload() { sub: userId }: JwtPayloadInterface,
    @Body() requestDto: TodoRequestDto,
    @Param() { categoryId }: CategoryIdDto,
  ) {
    await this.todoService.createTodo(userId, categoryId, requestDto);
  }

  @ApiOperation({ summary: 'Get List of todos' })
  @ApiOkResponse({ type: [TodoListResponseDto] })
  @Get(':categoryId')
  async getCategories(
    @JwtPayload() { sub: userId }: JwtPayloadInterface,
    @Param() { categoryId }: CategoryIdDto,
  ) {
    return this.todoService.getTodos(categoryId, userId);
  }

  @ApiOperation({ summary: 'Update a Todo' })
  @ApiOkResponse({ type: [TodoResponseDto] })
  @Put(':todoId')
  async updateTodo(
    @JwtPayload() { sub: userId }: JwtPayloadInterface,
    @Param() { todoId }: TodoIdDto,
    @Body() requestDto: TodoRequestDto,
  ) {
    return this.todoService.updateTodo(userId, todoId, requestDto);
  }
}
