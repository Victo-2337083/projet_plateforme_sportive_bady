import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController (supertest)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: { login: jest.fn().mockResolvedValue({ accessToken: 'token' }) } }]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /auth/login', async () => {
    await request(app.getHttpServer()).post('/auth/login').send({ username: 'x', password: 'y' }).expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
