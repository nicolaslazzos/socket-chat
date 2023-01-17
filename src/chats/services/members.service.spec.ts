import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MemberRole } from '../../chats/entities/member.entity';
import { MembersService } from './members.service';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { MemberRepository } from '../repositories/member.repository';
import { ChatRepository } from '../repositories/chat.repository';
import { memberStub } from '../test/member.stub';
import { UpdateMemberDto } from '../dtos/update-member.dto';

jest.mock('../repositories/member.repository');
jest.mock('../repositories/chat.repository');

describe('MembersService', () => {
  let membersService: MembersService;
  let memberRepository: MemberRepository;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: MemberRepository.name, useClass: MemberRepository as any },
        { provide: ChatRepository.name, useClass: ChatRepository as any },
      ],
    }).compile();

    membersService = moduleRef.get<MembersService>(MembersService);
    memberRepository = moduleRef.get<MemberRepository>(MemberRepository.name);
    chatRepository = moduleRef.get<ChatRepository>(ChatRepository.name);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when sending a valid chat id and dto', () => {
      it('should return the members created by the repository', async () => {
        const member = memberStub();

        const chat = member.chat as string;
        const dto: CreateMemberDto[] = [{ role: MemberRole.MEMBER, user: 'some_user_id' }];

        const result = await membersService.create(chat, dto);

        expect(result).toEqual([member]);
        expect(chatRepository.findById).toHaveBeenCalledWith(chat);
        expect(chatRepository.addUsersById).toHaveBeenCalledWith(chat, dto.map(u => u.user));
        expect(memberRepository.createMany).toHaveBeenCalled();
      });
    });

    describe('when sending a non-existing chat id and a valid dto', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(chatRepository, 'findById').mockResolvedValueOnce(null);

        const chat = 'non_existing_chat_id';
        const dto: CreateMemberDto[] = [{ role: MemberRole.MEMBER, user: 'some_user_id' }];

        const promise = membersService.create(chat, dto);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(chatRepository.findById).toHaveBeenCalledWith(chat);
        expect(chatRepository.addUsersById).not.toHaveBeenCalled();
        expect(memberRepository.createMany).not.toHaveBeenCalled();
      });
    });
  });

  describe('findById', () => {
    describe('when sending an existing id', () => {
      it('should return the member with the specified id', async () => {
        const member = memberStub();

        const result = await membersService.findById(member.id);

        expect(result).toEqual(member);
        expect(memberRepository.findById).toHaveBeenCalledWith(member.id);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'findById').mockResolvedValueOnce(null);

        const member = memberStub();

        const promise = membersService.findById(member.id);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(memberRepository.findById).toHaveBeenCalledWith(member.id);
      });
    });
  });

  describe('findByChat', () => {
    describe('when sending a chat id', () => {
      it('should return the list of members that belong to the specified chat', async () => {
        const member = memberStub();

        const chat = member.chat as string;

        const result = await membersService.findByChat(chat);

        expect(result).toEqual([member]);
        expect(memberRepository.findByChat).toHaveBeenCalledWith(chat);
      });
    });
  });

  describe('findByUser', () => {
    describe('when sending a user id', () => {
      it('should return the list of members that belong to the specified user', async () => {
        const member = memberStub();

        const user = member.user as string;

        const result = await membersService.findByUser(user);

        expect(result).toEqual([member]);
        expect(memberRepository.findByUser).toHaveBeenCalledWith(user);
      });
    });
  });

  describe('findByChatAndUser', () => {
    describe('when sending existings chat and user ids', () => {
      it('should return the member with the specified chat and user ids', async () => {
        const member = memberStub();

        const chat = member.chat as string;
        const user = member.user as string;

        const result = await membersService.findByChatAndUser('some_chat_id', 'some_user_id');

        expect(result).toEqual(member);
        expect(memberRepository.findByChatAndUser).toHaveBeenCalledWith(chat, user);
      });
    });

    describe('when sending an existing chat id and a non-existing user id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'findByChatAndUser').mockResolvedValueOnce(null);

        const chat = 'some_chat_id';
        const user = 'non_existing_user_id';

        const promise = membersService.findByChatAndUser(chat, user);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(memberRepository.findByChatAndUser).toHaveBeenCalledWith(chat, user);
      });
    });

    describe('when sending a non-existing chat id and an existing user id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'findByChatAndUser').mockResolvedValueOnce(null);

        const chat = 'non_existing_chat_id';
        const user = 'some_user_id';

        const promise = membersService.findByChatAndUser(chat, user);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(memberRepository.findByChatAndUser).toHaveBeenCalledWith(chat, user);
      });
    });
  });

  describe('findByChatAndUsers', () => {
    describe('when sending a chat and user ids', () => {
      it('should return the list of members of the specified chat with the specified users ids', async () => {
        const member = memberStub();

        const chat = member.chat as string;
        const users = [member.user as string];

        const result = await membersService.findByChatAndUsers(chat, users);

        expect(result).toEqual([member]);
        expect(memberRepository.findByChatAndUsers).toHaveBeenCalledWith(chat, users);
      });
    });
  });

  describe('updateById', () => {
    describe('when sending an existing id', () => {
      it('should return the updated member with the specified id', async () => {
        const member = memberStub();

        const dto: UpdateMemberDto = { role: MemberRole.ADMIN };

        const result = await membersService.updateById(member.id, dto);

        expect(result).toEqual(member);
        expect(memberRepository.updateById).toHaveBeenCalledWith(member.id, dto);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'updateById').mockResolvedValueOnce(null);

        const member = 'non_existing_id';
        const dto: UpdateMemberDto = { role: MemberRole.ADMIN };

        const promise = membersService.updateById(member, dto);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(memberRepository.updateById).toHaveBeenCalledWith(member, dto);
      });
    });
  });

  describe('deleteById', () => {
    describe('when sending an existing id', () => {
      it('should mark as deleted and return the member with the specified id', async () => {
        const member = memberStub();

        const chat = member.chat as string;
        const user = member.user as string;

        const result = await membersService.deleteById(member.id);

        expect(result).toEqual(member);
        expect(memberRepository.updateById).toHaveBeenCalled();
        expect(chatRepository.removeUsersById).toHaveBeenCalledWith(chat, [user]);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'updateById').mockResolvedValueOnce(null);

        const member = 'non_existing_id';

        const promise = membersService.deleteById(member);

        expect(promise).rejects.toThrow(NotFoundException);
        expect(memberRepository.updateById).toHaveBeenCalled();
        expect(chatRepository.removeUsersById).not.toHaveBeenCalled();
      });
    });
  });
});