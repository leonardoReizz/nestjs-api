import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infra/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.$connect();

    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.create({
      data: {
        email: 'authuser@example.com',
        hashed_password: hashedPassword,
        first_name: 'auth',
        last_name: 'user',
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/authenticate')
      .send({ email: 'authuser@example.com', password: 'password123' })
      .expect(200);

    authToken = loginResponse.body.access_token;
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany(); // Clean up the database
    await app.close();
  });

  it('/users (POST) should create a new user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createUserDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(createUserDto.email);
  });

  it('/users/:id (PATCH) should update a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test3@example.com',
        hashed_password: 'hashedpassword123',
        first_name: 'Test3',
        last_name: 'User3',
      },
    });

    if (!user || !user.id) throw new Error('User creation failed');

    const updateUserDto = {
      first_name: 'Updated',
      last_name: 'Name',
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateUserDto)
      .expect(200);

    const responseBody = response.body as { first_name: string };
    if (!responseBody || typeof responseBody.first_name !== 'string')
      throw new Error(
        'Response body or first_name is undefined or not a string',
      );

    expect(responseBody.first_name).toBe(updateUserDto.first_name);
  });

  it('/users/:id (DELETE) should remove a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test4@example.com',
        hashed_password: 'hashedpassword123',
        first_name: 'Test4',
        last_name: 'User4',
      },
    });

    if (!user || !user.id) throw new Error('User creation failed');

    await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(deletedUser).toBeNull();
  });

  it('/users/:id (GET) should return a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test44@example.com',
        hashed_password: 'hashedpassword123',
        first_name: 'Test4',
        last_name: 'User4',
      },
    });

    if (!user || !user.id) throw new Error('User creation failed');

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const responseBody = response.body as { email: string };
    if (!responseBody || typeof responseBody.email !== 'string')
      throw new Error('Response body or email is undefined or not a string');

    expect(responseBody.email).toBe(user.email);
  });
});
