import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { chatStub } from '../test/chat.stub';
import { ChatRepository } from './chat.repository';
import { ChatMongoRepository } from './chat.mongo.repository';
import { Chat as ChatModel } from '../models/chat.model';
import { CreateChatDto } from '../dtos/create-chat.dto';

jest.mock('../models/chat.model');

describe('ChatMongoRepository', () => {
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(ChatModel.name), useClass: ChatModel },
        { provide: ChatRepository.name, useClass: ChatMongoRepository },
      ],
    }).compile();

    chatRepository = moduleRef.get<ChatRepository>(ChatRepository.name);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return the chat created', async () => {
      const chat = chatStub();

      const dto: CreateChatDto = {
        type: chat.type,
        name: chat.name,
        owner: chat.owner as string,
        createdBy: chat.createdBy as string,
        members: [],
      };

      const result = await chatRepository.create(dto);

      expect(result).toEqual(chat);
    });
  });

  describe('findById', () => {
    it('should return the chat with the specified id', async () => {
      const chat = chatStub();

      const result = await chatRepository.findById(chat.id);

      expect(result).toEqual(chat);
    });
  });

  describe('findByUser', () => {
    it('should return the list of chats with the specified user', async () => {
      const chat = chatStub();

      const result = await chatRepository.findByUser(chat.owner as string);

      expect(result).toEqual([chat]);
    });
  });

  describe('findByTypeAndUsers', () => {
    it('should return the list of chats with the specified type and users', async () => {
      const chat = chatStub();

      const result = await chatRepository.findByTypeAndUsers(chat.type, chat.users as string[]);

      expect(result).toEqual([chat]);
    });
  });

  describe('updateById', () => {
    it('should return the updated chat with the specified id', async () => {
      const chat = chatStub();

      const result = await chatRepository.updateById(chat.id, { name: 'new_name' });

      expect(result).toEqual(chat);
    });
  });

  describe('addUsersById', () => {
    it('should add the users to the chat with the specified id and return it', async () => {
      const chat = chatStub();

      const result = await chatRepository.addUsersById(chat.id, ['another_user_id']);

      expect(result).toEqual(chat);
    });
  });

  describe('removeUsersById', () => {
    it('should remove the users from the chat with the specified id and return it', async () => {
      const chat = chatStub();

      const result = await chatRepository.removeUsersById(chat.id, ['another_user_id']);

      expect(result).toEqual(chat);
    });
  });
});