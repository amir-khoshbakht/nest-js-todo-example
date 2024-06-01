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
import { CategoryRequestDto } from '../dto/category.request.dto';
import { CategoryResponseDto } from '../dto/category.response';
import { TodoService } from '../services/todo.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { JwtPayloadInterface } from '../../auth/jwt.strategy';
import { JwtPayload } from '../../auth/jwt-payload.decorator';

@ApiTags('Todo - Category')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('todo/category')
export class CategoryController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: 'Create a category' })
  @ApiCreatedResponse({ description: 'Category created successfully.' })
  @Post()
  async create(
    @JwtPayload() { sub: userId }: JwtPayloadInterface,
    @Body() requestDto: CategoryRequestDto,
  ) {
    await this.todoService.createCategory(userId, requestDto);
  }

  @ApiOperation({ summary: 'Get List of categories' })
  @ApiOkResponse({ type: [CategoryResponseDto] })
  @Get()
  async getCategories(@JwtPayload() { sub: userId }: JwtPayloadInterface) {
    return this.todoService.getCategories(userId);
  }

  @ApiOperation({ summary: 'Update a Category' })
  @ApiOkResponse({ type: [CategoryResponseDto] })
  @Put(':categoryId')
  async updateCategory(
    @JwtPayload() { sub: userId }: JwtPayloadInterface,
    @Param() { categoryId }: CategoryIdDto,
    @Body() requestDto: CategoryRequestDto,
  ) {
    return this.todoService.updateCategory(userId, categoryId, requestDto);
  }
}
