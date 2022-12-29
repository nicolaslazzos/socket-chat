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
        creator: chat.creator as string,
        members: []
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

  describe('findByIds', () => {
    it('should return the chat with the specified ids', async () => {
      const chat = chatStub();

      const result = await chatRepository.findByIds([chat.id]);

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
});