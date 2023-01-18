import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { messageStub } from '../test/message.stub';
import { MessageRepository } from './message.repository';
import { MessageMongoRepository } from './message.mongo.repository';
import { Message as MessageModel } from '../models/message.model';
import { CreateMessageDto } from '../dtos/create-message.dto';

jest.mock('../models/message.model');

describe('MessageMongoRepository', () => {
  let messageRepository: MessageRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(MessageModel.name), useClass: MessageModel },
        { provide: MessageRepository.name, useClass: MessageMongoRepository },
      ],
    }).compile();

    messageRepository = moduleRef.get<MessageRepository>(MessageRepository.name);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return the message created', async () => {
      const message = messageStub();

      const dto: CreateMessageDto = {
        chat: message.chat as string,
        text: message.text
      };

      const result = await messageRepository.create(dto);

      expect(result).toEqual(message);
    });
  });

  describe('findById', () => {
    it('should return the message with the specified id', async () => {
      const message = messageStub();

      const result = await messageRepository.findById(message.id);

      expect(result).toEqual(message);
    });
  });

  describe('findByUser', () => {
    it('should return the list of messages of the specified user', async () => {
      const message = messageStub();

      const result = await messageRepository.findByUser(message.user as string);

      expect(result).toEqual([message]);
    });
  });

  describe('findByChat', () => {
    it('should return the list of messages of the specified chat', async () => {
      const message = messageStub();

      const result = await messageRepository.findByChat(message.chat as string);

      expect(result).toEqual([message]);
    });
  });

  describe('updateById', () => {
    it('should return the updated message with the specified id', async () => {
      const message = messageStub();

      const result = await messageRepository.updateById(message.id, { text: 'this is an updated message' });

      expect(result).toEqual(message);
    });
  });
});