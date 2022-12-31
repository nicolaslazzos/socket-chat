import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MemberRole, MemberStatus } from '../../members/entities/member.entity';
import { MembersService } from '../../members/services/members.service';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { MemberRepository } from '../repositories/member.repository';
import { memberStub } from '../test/member.stub';

jest.mock('../repositories/member.repository');

describe('MembersService', () => {
  let membersService: MembersService;
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: MemberRepository.name, useClass: MemberRepository as any },
      ],
    }).compile();

    membersService = moduleRef.get<MembersService>(MembersService);
    memberRepository = moduleRef.get<MemberRepository>(MemberRepository.name);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when sending a valid chat id and dto', () => {
      it('should return the members created by the repository', async () => {
        const member = memberStub();

        const dto: CreateMemberDto = { role: MemberRole.MEMBER, user: 'some_user_id' };

        const result = await membersService.create('some_chat_id', [dto]);

        expect(result).toEqual([member]);
      });
    });
  });

  describe('findById', () => {
    describe('when sending an existing id', () => {
      it('should return the member with the specified id', async () => {
        const member = memberStub();

        const result = await membersService.findById(member.id);

        expect(result).toEqual(member);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'findById').mockResolvedValueOnce(null);

        const member = memberStub();

        const promise = membersService.findById(member.id);

        expect(promise).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('findByChat', () => {
    describe('when sending a chat id', () => {
      it('should return the list of members that belong to the specified chat', async () => {
        const member = memberStub();

        const result = await membersService.findByChat('some_chat_id');

        expect(result).toEqual([member]);
      });
    });
  });

  describe('findByUser', () => {
    describe('when sending a user id', () => {
      it('should return the list of members that belong to the specified user', async () => {
        const member = memberStub();

        const result = await membersService.findByUser('some_user_id');

        expect(result).toEqual([member]);
      });
    });
  });

  describe('findByChatAndUser', () => {
    describe('when sending existings chat and user ids', () => {
      it('should return the member with the specified chat and user ids', async () => {
        const member = memberStub();

        const result = await membersService.findByChatAndUser('some_chat_id', 'some_user_id');

        expect(result).toEqual(member);
      });
    });

    describe('when sending an existing chat id and a non-existing user id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'findByChatAndUser').mockResolvedValueOnce(null);

        const promise = membersService.findByChatAndUser('some_chat_id', 'non_existing_user_id');

        expect(promise).rejects.toThrow(NotFoundException);
      });
    });

    describe('when sending a non-existing chat id and an existing user id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'findByChatAndUser').mockResolvedValueOnce(null);

        const promise = membersService.findByChatAndUser('non_existing_chat_id', 'some_user_id');

        expect(promise).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('findByChatAndUsers', () => {
    describe('when sending a chat and user ids', () => {
      it('should return the list of members of the specified chat with the specified users ids', async () => {
        const member = memberStub();

        const result = await membersService.findByChatAndUsers('some_chat_id', ['some_user_id']);

        expect(result).toEqual([member]);
      });
    });
  });

  describe('updateById', () => {
    describe('when sending an existing id', () => {
      it('should return the updated member with the specified id', async () => {
        const member = memberStub();

        const result = await membersService.updateById(member.id, { status: MemberStatus.MUTED });

        expect(result).toEqual(member);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'updateById').mockResolvedValueOnce(null);

        const promise = membersService.updateById('non_existing_id', { status: MemberStatus.MUTED });

        expect(promise).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('deleteById', () => {
    describe('when sending an existing id', () => {
      it('should mark as deleted and return the member with the specified id', async () => {
        const member = memberStub();

        const result = await membersService.deleteById(member.id);

        expect(result).toEqual(member);
      });
    });

    describe('when sending a non-existing id', () => {
      it('should throw a not found exception', async () => {
        jest.spyOn(memberRepository, 'updateById').mockResolvedValueOnce(null);

        const promise = membersService.deleteById('non_existing_id');

        expect(promise).rejects.toThrow(NotFoundException);
      });
    });
  });
});