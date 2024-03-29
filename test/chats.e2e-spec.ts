import * as request from 'supertest';
import { ValidationPipe, HttpStatus, CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { Types } from 'mongoose';
import { configValidationSchema } from '../src/config.schema';
import { ChatsModule } from '../src/chats/chats.module';
import { CreateChatDto } from '../src/chats/dtos/create-chat.dto';
import { Chat, ChatType } from '../src/chats/entities/chat.entity';
import { AuthService } from '../src/auth/services/auth.service';
import { userStub } from '../src/auth/test/user.stub';
import { User } from '../src/auth/entities/user.entity';
import { MemberRole } from '../src/chats/entities/member.entity';
import { UpdateChatDto } from '../src/chats/dtos/update-chat.dto';

describe('Chats', () => {
  let mongod: MongoMemoryServer;
  let app: INestApplication;
  let authService: AuthService;
  let users: { user: User, authorization: string; }[];
  let user: User;
  let chat: Chat;
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

    users = await Promise.all([
      userStub({ name: 'some' }),
      userStub({ name: 'other' }),
      userStub({ name: 'another' })
    ].map(({ username, password }) => {
      return new Promise<{ user: User, authorization: string; }>(async (resolve) => {
        const user = await authService.signUp({ username, password });

        const { access_token } = await authService.signIn({ username, password });

        resolve({ user, authorization: `Bearer ${access_token}` });
      });
    }));

    user = users[0].user;
    authorization = users[0].authorization;

    // init app
    await app.init();
  });

  describe(`POST /chats`, () => {
    describe(`when sending a valid body`, () => {
      it(`should return the created chat`, async () => {
        const dto: CreateChatDto = {
          type: ChatType.PUBLIC,
          members: [...users].splice(0, 2).map(({ user }) => ({ user: user.id, role: MemberRole.MEMBER }))
        };

        return request(app.getHttpServer())
          .post('/chats')
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => {
            chat = body;
            expect(body.id).toBeDefined();
            expect(body.type).toEqual(dto.type);
            expect(body.users.map((u: User) => u.id)).toEqual(dto.members.map(m => m.user));
          });
      });
    });

    describe(`when sending a valid body with type direct`, () => {
      it(`should return the created chat`, async () => {
        const dto: CreateChatDto = {
          type: ChatType.DIRECT,
          members: [...users].splice(0, 2).map(({ user }) => ({ user: user.id, role: MemberRole.MEMBER }))
        };

        return request(app.getHttpServer())
          .post('/chats')
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => {
            expect(body.id).toBeDefined();
            expect(body.type).toEqual(dto.type);
            expect(body.users.map((u: User) => u.id)).toEqual(dto.members.map(m => m.user));
          });
      });
    });

    describe(`when sending an body with type direct and it already exists`, () => {
      it(`should throw a conflict exception`, async () => {
        const dto: CreateChatDto = {
          type: ChatType.DIRECT,
          members: [...users].splice(0, 2).map(({ user }) => ({ user: user.id, role: MemberRole.MEMBER }))
        };

        return request(app.getHttpServer())
          .post('/chats')
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.CONFLICT);
      });
    });

    describe(`when sending an body with type direct and more than two members`, () => {
      it(`should throw a bad request exception`, async () => {
        const dto: CreateChatDto = {
          type: ChatType.DIRECT,
          members: [...users].map(({ user }) => ({ user: user.id, role: MemberRole.MEMBER }))
        };

        return request(app.getHttpServer())
          .post('/chats')
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe(`GET /chats`, () => {
    describe(`when the user is member of at least one chat`, () => {
      it(`should return the list of chats in which the requesting user is a member`, async () => {
        return request(app.getHttpServer())
          .get('/chats')
          .set('Authorization', authorization)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body?.length > 0).toBeTruthy();
          });
      });
    });

    describe(`when the user is not a member of any chat`, () => {
      it(`should return an empty list`, async () => {
        const { authorization } = [...users].pop();

        return request(app.getHttpServer())
          .get('/chats')
          .set('Authorization', authorization)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body?.length == 0).toBeTruthy();
          });
      });
    });
  });

  describe(`GET /chats/:chat`, () => {
    describe(`when sending an existing id`, () => {
      it(`should return the chat with the specified id`, async () => {
        return request(app.getHttpServer())
          .get(`/chats/${chat.id}`)
          .set('Authorization', authorization)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body.id).toEqual(chat.id);
          });
      });
    });

    describe(`when sending a non-existing id`, () => {
      it(`should throw a not found exception`, async () => {
        const id = new Types.ObjectId();

        return request(app.getHttpServer())
          .get(`/chats/${id}`)
          .set('Authorization', authorization)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe(`PATCH /chats/:chat`, () => {
    describe(`when sending an existing id with a valid body`, () => {
      it(`should return the updated chat with the specified id`, async () => {
        const dto: UpdateChatDto = { name: 'new_name' };

        return request(app.getHttpServer())
          .patch(`/chats/${chat.id}`)
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body.id).toEqual(chat.id);
            expect(body.name).toEqual(dto.name);
          });
      });
    });

    describe(`when sending an existing id with an invalid body`, () => {
      it(`should throw a bad request exception`, async () => {
        const dto: UpdateChatDto = { type: 'some_invalid_type' as ChatType };

        return request(app.getHttpServer())
          .patch(`/chats/${chat.id}`)
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe(`when sending a non-existing id with a valid body`, () => {
      it(`should throw a not found exception`, async () => {
        const id = new Types.ObjectId();
        const dto: UpdateChatDto = { name: 'new_name' };

        return request(app.getHttpServer())
          .get(`/chats/${id}`)
          .set('Authorization', authorization)
          .send(dto)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe(`DELETE /chats/:chat`, () => {
    describe(`when sending an existing id`, () => {
      it(`should return the chat with the specified id marked as deleted`, async () => {
        return request(app.getHttpServer())
          .delete(`/chats/${chat.id}`)
          .set('Authorization', authorization)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body.id).toEqual(chat.id);
            expect(body.deletedAt).toBeDefined();
            expect(body.deletedBy).toEqual(user.id);
          });
      });
    });

    describe(`when sending the id of a deleted chat`, () => {
      it(`should throw a not found exception`, async () => {
        return request(app.getHttpServer())
          .delete(`/chats/${chat.id}`)
          .set('Authorization', authorization)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    describe(`when sending a non-existing id`, () => {
      it(`should throw a not found exception`, async () => {
        const id = new Types.ObjectId();

        return request(app.getHttpServer())
          .get(`/chats/${id}`)
          .set('Authorization', authorization)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});