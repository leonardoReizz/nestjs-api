import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infra/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        hashed_password: hashedPassword,
        first_name: 'Test',
        last_name: 'User',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany(); // Clean up the database
    await app.close();
  });

  it('/authenticate (POST) should authenticate user and return a token', async () => {
    const loginDto = {
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/authenticate')
      .send(loginDto)
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
  });
});
