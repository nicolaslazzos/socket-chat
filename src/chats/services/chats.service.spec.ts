import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MemberRole } from '../entities/member.entity';
import { MembersService } from './members.service';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { ChatType } from '../entities/chat.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatsService } from '../services/chats.service';
import { chatStub } from '../test/chat.stub';
import { UpdateChatDto } from '../dtos/update-chat.dto';

jest.mock('../repositories/chat.repository');
jest.mock('./members.service');

describe('ChatsService', () => {
  let chatsService: ChatsService;
  let chatsRepository: ChatRepository;
  let membersService: MembersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatsService,
        MembersService,
        { provide: ChatRepository.name, useClass: ChatRepository as any },
      ],
    }).compile();

    chatsService = moduleRef.get<ChatsService>(ChatsService);
    chatsRepository = moduleRef.get<ChatRepository>(ChatRepository.name);
    membersService = moduleRef.get<MembersService>(MembersService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when sending a valid dto', () => {
      it('should return the chat created by the repository', async () => {
        const chat = chatStub();

        const dto: CreateChatDto = {
          type: ChatType.PUBLIC,
          name: 'some_name',
          createdBy: 'creator_user_id',
          members: [
            { user: 'creator_user_id', role: MemberRole.ADMIN },
            { user: 'some_user_id', role: MemberRole.MEMBER }
          ]
        };

        const result = await chatsService.create(dto);

        expect(result).toEqual(chat);
        expect(chatsRepository.create).toHaveBeenCalled();
        expect(membersService.create).toHaveBeenCalled();
      });
    });

    describe('when sending a dto with type direct and more than two members', () => {
      it('should throw a bad request exception', async () => {
        const dto: CreateChatDto = {
          type: ChatType.DIRECT,
          name: 'some_name',
          createdBy: 'creator_user_id',
          members: [
            { user: 'creator_user_id', role: MemberRole.ADMIN },
            { user: 'some_user_id', role: MemberRole.MEMBER },
            { user: 'other_user_id', role: MemberRole.MEMBER }
          ]
        };

        const promise = chatsService.create(dto);

        expect(promise).rejects.toThrow(BadRequestException);
        expect(chatsRepository.findByTypeAndUsers).not.toHaveBeenCalled();
        expect(chatsRepository.create).not.toHaveBeenCalled();
        expect(membersService.create).not.toHaveBeenCalled();
      });
    });

    describe('when sending a dto with type direct and it already exists', () => {
      it('should throw a conflict exception', async () => {
        const dto: CreateChatDto = {
          type: ChatType.DIRECT,
          name: 'some_name',
          createdBy: 'creator_user_id',
          members: [
            { user: 'creator_user_id', role: MemberRole.ADMIN },
            { user: 'some_user_id', role: MemberRole.MEMBER }
          ]
        };

        const promise = chatsService.create(dto);

        expect(promise).rejects.toThrow(ConflictException);
        expect(chatsRepository.findByTypeAndUsers).toHaveBeenCalled();
        expect(chatsRepository.create).not.toHaveBeenCalled();
        expect(membersService.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('findById', () => {
    describe('when sending an existing id', () => {
      it('should return the chat from the repository', async () => {
        const chat = chatStub();

        const result = await chatsService.findById(chat.id);

        expect(result).toEqual(chat);
        expect(chatsRepository.findById).toHaveBeenCalledWith(chat.id);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(chatsRepository, 'findById').mockResolvedValueOnce(null);

        const id = 'non_existing_id';

        const promise = chatsService.findById(id);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(chatsRepository.findById).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('findByUser', () => {
    describe('when sending an existing user', () => {
      it('should return the list of chats in which the user is a member', async () => {
        const chat = chatStub();

        const id = 'some_user_id';

        const result = await chatsService.findByUser(id);

        expect(result).toEqual([chat]);
        expect(chatsRepository.findByUser).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('updateById', () => {
    describe('when sending an existing id', () => {
      it('should return the updated chat with the specified id', async () => {
        const chat = chatStub();

        const dto: UpdateChatDto = { name: 'new_name' };

        const result = await chatsService.updateById(chat.id, dto);

        expect(result).toEqual(chat);
        expect(chatsRepository.updateById).toHaveBeenCalledWith(chat.id, dto);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(chatsRepository, 'updateById').mockResolvedValueOnce(null);

        const id = 'non_existing_id';
        const dto: UpdateChatDto = { name: 'new_name' };

        const promise = chatsService.updateById(id, dto);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(chatsRepository.updateById).toHaveBeenCalledWith(id, dto);
      });
    });
  });

  describe('deleteById', () => {
    describe('when sending an existing id', () => {
      it('should mark as deleted and return the chat with the specified id', async () => {
        jest.spyOn(chatsService, 'updateById');

        const chat = chatStub();

        const result = await chatsService.deleteById(chat.id);

        expect(result).toEqual(chat);
        expect(chatsService.updateById).toHaveBeenCalled();
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(chatsService, 'updateById');
        jest.spyOn(chatsRepository, 'updateById').mockResolvedValueOnce(null);

        const promise = chatsService.deleteById('non_existing_id');

        expect(promise).rejects.toThrow(NotFoundException);
        expect(chatsService.updateById).toHaveBeenCalled();
      });
    });
  });
});