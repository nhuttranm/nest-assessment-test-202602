import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('PairsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST pairs (POST)', () => {
    const id1 = uuidv4();
    const id2 = uuidv4();
    
    return request(app.getHttpServer())
      .post('/pairs')
      .send({ id1, id2 })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id1');
        expect(res.body).toHaveProperty('id2');
        expect(res.body).toHaveProperty('userID');
        expect(res.body.id1).toBe(id1);
        expect(res.body.id2).toBe(id2);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});