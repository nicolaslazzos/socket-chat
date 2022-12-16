import * as request from 'supertest';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '../src/config.schema';
import { AuthModule } from '../src/auth/auth.module';
import { INestApplication } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dtos/auth-credentials.dto';

describe('Auth', () => {
  let mongod: MongoMemoryServer;
  let app: INestApplication;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ validationSchema: configValidationSchema }),
        MongooseModule.forRoot(mongod.getUri()),
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }));

    await app.init();
  });

  describe(`POST /auth/signup`, () => {
    describe(`when sending a valid username and password`, () => {
      it(`should return the created user`, async () => {
        const dto: AuthCredentialsDto = { username: 'some_username', password: 'Password123!' };

        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => expect(body.username).toEqual(dto.username));
      });
    });

    describe(`when sending an username that doesn't meet the requirements`, () => {
      it(`should throw a bad request exception`, async () => {
        const dto: AuthCredentialsDto = { username: 'some_very_long_username', password: 'Password123!' };

        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe(`when sending a password that doesn't meet the requirements`, () => {
      it(`should throw a bad request exception`, async () => {
        const dto: AuthCredentialsDto = { username: 'some_username', password: 'weak_password' };

        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe(`POST /auth/signin`, () => {
    describe(`when sending a valid username and password`, () => {
      it(`should return the generated access token`, async () => {
        const dto: AuthCredentialsDto = { username: 'some_username', password: 'Password123!' };

        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => expect(body.access_token).toBeDefined());
      });
    });

    describe(`when sending a non-existing username`, () => {
      it(`should throw an unauthorized exception`, async () => {
        const dto: AuthCredentialsDto = { username: 'wrong_username', password: 'Password123!' };

        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`when sending a valid username and an invalid password`, () => {
      it(`should throw an unauthorized exception`, async () => {
        const dto: AuthCredentialsDto = { username: 'some_username', password: 'Password1234?' };

        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});