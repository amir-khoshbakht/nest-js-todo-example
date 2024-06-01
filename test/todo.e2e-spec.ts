import { Todo, TodoDocument } from './../src/todo/schemas/todo.schema';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RegisterRequestDto } from '../src/auth/dto/register.request.dto';
import { CategoryRequestDto } from '../src/todo/dto/category.request.dto';
import { Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from '../src/todo/schemas/category.schema';
import { getModelToken } from '@nestjs/mongoose';
import { TodoRequestDto } from '../src/todo/dto/todo.request.dto';
import { User, UserDocument } from '../src/user/schema/user.schema';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('TodoControllers (e2e)', () => {
  let app: INestApplication;
  let httpClient: request.SuperTest<request.Test>;
  let categoryModel: Model<CategoryDocument>;
  let todoModel: Model<TodoDocument>;
  let userModel: Model<UserDocument>;
  let user: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = { sub: user.id };
          return true;
        },
      })
      .compile();

    categoryModel = moduleFixture.get<Model<CategoryDocument>>(
      getModelToken(Category.name),
    );

    todoModel = moduleFixture.get<Model<TodoDocument>>(
      getModelToken(Todo.name),
    );

    userModel = moduleFixture.get<Model<UserDocument>>(
      getModelToken(User.name),
    );
    const userDto: RegisterRequestDto = {
      username: 'category name',
      password: 'password',
    };

    // create a test user
    user = await userModel.create(userDto);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    httpClient = request(app.getHttpServer());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('TodoCategoryController (e2e)', () => {
    it('/todo/category (POST) should create a new category', async () => {
      // todo : duplicate code, refactor.
      const body: CategoryRequestDto = {
        title: 'category name',
      };
      await request(app.getHttpServer())
        .post('/todo/category/')
        .send(body)
        .expect(HttpStatus.CREATED);

      const categories = await categoryModel.find();
      expect(categories).toHaveLength(1);
    });

    it('/todo/category (GET) should get list of categories', async () => {
      // todo : duplicate code, refactor.
      // create a category
      const categoryData: CategoryRequestDto = {
        title: 'category name',
      };
      await categoryModel.create({ ...categoryData, user });

      return request(app.getHttpServer())
        .get('/todo/category/')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(Array.isArray(body)).toBeTruthy();
          expect(body).toHaveLength(1);
        });
    });

    it('/todo/category (PUT) should update a category', async () => {
      // todo : duplicate code, refactor.
      // create a category
      const categoryData: CategoryRequestDto = {
        title: 'category name',
      };
      const categoryDataUpdated: CategoryRequestDto = {
        title: 'category name new',
      };
      const category = await categoryModel.create({ ...categoryData, user });

      return request(app.getHttpServer())
        .put('/todo/category/' + category.id)
        .send(categoryDataUpdated)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveProperty('title');
          expect(body.title == categoryDataUpdated.title).toBeTruthy();
        });
    });
  });

  describe('TodoController (e2e)', () => {
    it('/todo/todo/{:categoryId} (POST) should create a new todo', async () => {
      // todo : duplicate code, refactor

      // create a category
      const categoryData: CategoryRequestDto = {
        title: 'category name',
      };
      const category = await categoryModel.create({ ...categoryData, user });

      const body: TodoRequestDto = {
        title: 'todo name',
        description: 'todo description',
        priority: 0,
      };

      const categoryId = category.id;

      await request(app.getHttpServer())
        .post('/todo/todo/' + categoryId)
        .send(body)
        .expect(HttpStatus.CREATED);

      // should be persisted in database
      const todos = await todoModel.find();
      expect(todos).toHaveLength(1);
    });

    it('/todo/todo{:categoryId} (GET) should get list of todos', async () => {
      // todo : duplicate code, refactor.
      // create a category
      const categoryData: CategoryRequestDto = {
        title: 'category name',
      };
      const category = await categoryModel.create({ ...categoryData, user });
      const categoryId = category.id;

      // create a todo
      const todoData: TodoRequestDto = {
        title: 'category name',
        description: 'category description',
        priority: 0,
      };
      await todoModel.create({
        ...todoData,
        category: categoryId,
      });

      return request(app.getHttpServer())
        .get('/todo/todo/' + categoryId)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveProperty('category');
          expect(body).toHaveProperty('todoList');
          expect(Array.isArray(body.todoList)).toBe(true);
          expect(body.todoList).toHaveLength(1);
        });
    });

    it('/todo/todo{:categoryId} (PUT) should update a todos', async () => {
      // todo : duplicate code, refactor.
      // create a category
      const categoryData: CategoryRequestDto = {
        title: 'category name',
      };
      const category = await categoryModel.create({ ...categoryData, user });
      const categoryId = category.id;

      // create a todo
      const todoData: TodoRequestDto = {
        title: 'category name',
        description: 'category description',
        priority: 0,
      };
      const todo = await todoModel.create({
        ...todoData,
        category: categoryId,
      });
      const todoId = todo.id;

      const todoDateUpdated: TodoRequestDto = {
        ...todoData,
        priority: 10,
      };

      return request(app.getHttpServer())
        .put('/todo/todo/' + todoId)
        .send(todoDateUpdated)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveProperty('priority');
          expect(body.priority).toBe(10);
        });
    });
  });
});
