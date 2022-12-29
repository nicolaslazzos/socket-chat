import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MemberRole } from '../../members/entities/member.entity';
import { MembersService } from '../../members/services/members.service';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { ChatType } from '../entities/chat.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatsService } from '../services/chats.service';
import { chatStub } from '../test/chat.stub';

jest.mock('../repositories/chat.repository');

describe('ChatsService', () => {
  let chatsService: ChatsService;
  let chatsRepository: ChatRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatsService,
        { provide: MembersService, useValue: { create: jest.fn(), findByUser: jest.fn().mockResolvedValue([]) } },
        { provide: ChatRepository.name, useClass: ChatRepository as any },
      ],
    }).compile();

    chatsService = moduleRef.get<ChatsService>(ChatsService);
    chatsRepository = moduleRef.get<ChatRepository>(ChatRepository.name);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when sending a valid dto', () => {
      it('should return the chat created by the repository', async () => {
        const chat = chatStub();

        const dto: CreateChatDto = {
          type: ChatType.DIRECT,
          name: 'some_name',
          creator: 'creator_user_id',
          members: [
            { user: 'creator_user_id', role: MemberRole.ADMIN },
            { user: 'some_user_id', role: MemberRole.MEMBER }
          ]
        };

        const result = await chatsService.create(dto);

        expect(result).toEqual(chat);
      });
    });

    describe('when sending a dto with type direct and more than two members', () => {
      it('should throw a bad request exception', async () => {
        const dto: CreateChatDto = {
          type: ChatType.DIRECT,
          name: 'some_name',
          creator: 'creator_user_id',
          members: [
            { user: 'creator_user_id', role: MemberRole.ADMIN },
            { user: 'some_user_id', role: MemberRole.MEMBER },
            { user: 'other_user_id', role: MemberRole.MEMBER }
          ]
        };

        const promise = chatsService.create(dto);

        expect(promise).rejects.toThrow(BadRequestException);
      });
    });
  });

  describe('findById', () => {
    describe('when sending an existing id', () => {
      it('should return the chat from the repository', async () => {
        const chat = chatStub();

        const result = await chatsService.findById(chat.id);

        expect(result).toEqual(chat);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(chatsRepository, 'findById').mockResolvedValueOnce(null);

        const promise = chatsService.findById('non_existing_id');

        expect(promise).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('findByUser', () => {
    describe('when sending an existing user', () => {
      it('should return the list of chats in which the user is a member', async () => {
        const chat = chatStub();

        const result = await chatsService.findByUser('some_user_id');

        expect(result).toEqual([chat]);
      });
    });
  });

  describe('updateById', () => {
    describe('when sending an existing id', () => {
      it('should return the updated chat with the specified id', async () => {
        const chat = chatStub();

        const result = await chatsService.updateById(chat.id, { name: 'new_name' });

        expect(result).toEqual(chat);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(chatsRepository, 'updateById').mockResolvedValueOnce(null);

        const promise = chatsService.updateById('non_existing_id', { name: 'new_name' });

        expect(promise).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('deleteById', () => {
    describe('when sending an existing id', () => {
      it('should mark as deleted and return the chat with the specified id', async () => {
        const chat = chatStub();

        const result = await chatsService.deleteById(chat.id);

        expect(result).toEqual(chat);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(chatsRepository, 'updateById').mockResolvedValueOnce(null);

        const promise = chatsService.deleteById('non_existing_id');

        expect(promise).rejects.toThrow(NotFoundException);
      });
    });
  });
});