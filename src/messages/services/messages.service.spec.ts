import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { MessageRepository } from '../repositories/message.repository';
import { messageStub } from '../test/message.stub';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';

jest.mock('../repositories/message.repository');

describe('MessagesService', () => {
  let messagesService: MessagesService;
  let messagesRepository: MessageRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MessagesService, { provide: MessageRepository.name, useClass: MessageRepository as any }]
    }).compile();

    messagesService = moduleRef.get<MessagesService>(MessagesService);
    messagesRepository = moduleRef.get<MessageRepository>(MessageRepository.name);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when sending a valid dto', () => {
      it('should return the message created by the repository', async () => {
        const message = messageStub();

        const dto: CreateMessageDto = {
          chat: message.chat as string,
          text: message.text
        };

        const result = await messagesService.create(dto);

        expect(result).toEqual(message);
        expect(messagesRepository.create).toHaveBeenCalledWith(dto);
      });
    });
  });

  describe('findById', () => {
    describe('when sending an existing id', () => {
      it('should return the message from the repository', async () => {
        const message = messageStub();

        const result = await messagesService.findById(message.id);

        expect(result).toEqual(message);
        expect(messagesRepository.findById).toHaveBeenCalledWith(message.id);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(messagesRepository, 'findById').mockResolvedValueOnce(null);

        const id = 'non_existing_id';

        const promise = messagesService.findById(id);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(messagesRepository.findById).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('findByChat', () => {
    describe('when sending an existing chat id', () => {
      it('should return the list of messages sent to the chat', async () => {
        const message = messageStub();

        const id = message.chat as string;

        const result = await messagesService.findByChat(id);

        expect(result).toEqual([message]);
        expect(messagesRepository.findByChat).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('updateById', () => {
    describe('when sending an existing id', () => {
      it('should return the updated message with the specified id', async () => {
        const message = messageStub();

        const chat = message.chat as string;
        const dto: UpdateMessageDto = { text: 'this is an updated message' };

        const result = await messagesService.updateById(chat, dto);

        expect(result).toEqual(message);
        expect(messagesRepository.updateById).toHaveBeenCalledWith(chat, dto);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(messagesRepository, 'updateById').mockResolvedValueOnce(null);

        const chat = 'non_existing_id';
        const dto: UpdateMessageDto = { text: 'this is an updated message' };

        const promise = messagesService.updateById(chat, dto);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(messagesRepository.updateById).toHaveBeenCalledWith(chat, dto);
      });
    });
  });

  describe('deleteById', () => {
    describe('when sending an existing id', () => {
      it('should mark as deleted and return the message with the specified id', async () => {
        jest.spyOn(messagesService, 'updateById');

        const message = messageStub();

        const result = await messagesService.deleteById(message.id);

        expect(result).toEqual(message);
        expect(messagesService.updateById).toHaveBeenCalled();
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(messagesService, 'updateById');
        jest.spyOn(messagesRepository, 'updateById').mockResolvedValueOnce(null);

        const promise = messagesService.deleteById('non_existing_id');

        expect(promise).rejects.toThrow(NotFoundException);
        expect(messagesService.updateById).toHaveBeenCalled();
      });
    });
  });
});