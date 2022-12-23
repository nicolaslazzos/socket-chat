import * as request from 'supertest';
import { ValidationPipe, HttpStatus, CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { configValidationSchema } from '../src/config.schema';
import { ChatsModule } from '../src/chats/chats.module';
import { CreateChatDto } from '../src/chats/dtos/create-chat.dto';
import { ChatType } from '../src/chats/entities/chat.entity';
import { AuthService } from '../src/auth/services/auth.service';
import { userStub } from '../src/auth/test/user.stub';
import { User } from '../src/auth/entities/user.entity';
import { MemberRole } from '../src/members/entities/member.entity';

describe('Chats', () => {
  let mongod: MongoMemoryServer;
  let app: INestApplication;
  let authService: AuthService;
  let users: User[];
  let user: User;
  let authorization: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    // create testing module
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ validationSchema: configValidationSchema }),
        CacheModule.register(),
        MongooseModule.forRoot(mongod.getUri()),
        ChatsModule
      ]
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }));

    // initialize at least two users
    authService = app.get<AuthService>(AuthService);

    const { username, password } = userStub({ name: 'some' });

    users = [userStub({ name: 'some' }), userStub({ name: 'other' })];

    users = await Promise.all(users.map(({ username, password }) => authService.signUp({ username, password })));

    user = users[0];

    const { access_token } = await authService.signIn({ username, password });

    authorization = `Bearer ${access_token}`;

    // init app
    await app.init();
  });

  describe(`POST /chats`, () => {
    describe(`when sending a valid body`, () => {
      it(`should return the created chat`, async () => {
        const members = users.map((user) => ({ user: user.id, role: MemberRole.MEMBER }));
        const dto: CreateChatDto = { type: ChatType.DIRECT, members };

        return request(app.getHttpServer())
          .post('/chats')
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => {
            expect(body.id).toBeDefined();
            expect(body.creator).toEqual(user.id);
            expect(body.type).toEqual(dto.type);
          });
      });
    });

    describe(`when sending an invalid body`, () => {
      it(`should throw a bad request exception`, async () => {
        const dto = { type: ChatType.DIRECT };

        return request(app.getHttpServer())
          .post('/chats')
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});