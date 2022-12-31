import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { memberStub } from '../test/member.stub';
import { MemberRepository } from './member.repository';
import { MemberMongoRepository } from './member.mongo.repository';
import { Member as MemberModel } from '../models/member.model';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { MemberRole, MemberStatus } from '../entities/member.entity';

jest.mock('../models/member.model');

describe('MmebersMongoRepository', () => {
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(MemberModel.name), useClass: MemberModel },
        { provide: MemberRepository.name, useClass: MemberMongoRepository },
      ],
    }).compile();

    memberRepository = moduleRef.get<MemberRepository>(MemberRepository.name);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return the member created', async () => {
      const member = memberStub();

      const dto: CreateMemberDto = {
        role: MemberRole.MEMBER,
        chat: 'some_chat_id',
        user: 'some_user_id'
      };

      const result = await memberRepository.create(dto);

      expect(result).toEqual(member);
    });
  });

  describe('createMany', () => {
    it('should return the members created', async () => {
      const member = memberStub();

      const dto: CreateMemberDto = {
        role: MemberRole.MEMBER,
        chat: 'some_chat_id',
        user: 'some_user_id'
      };

      const result = await memberRepository.createMany([dto]);

      expect(result).toEqual([member]);
    });
  });

  describe('findById', () => {
    it('should return the member with the specified id', async () => {
      const member = memberStub();

      const result = await memberRepository.findById(member.id);

      expect(result).toEqual(member);
    });
  });

  describe('findByUser', () => {
    it('should return the members with the specified user id', async () => {
      const member = memberStub();

      const result = await memberRepository.findByUser('some_user_id');

      expect(result).toEqual([member]);
    });
  });

  describe('findByChat', () => {
    it('should return the members with the specified chat id', async () => {
      const member = memberStub();

      const result = await memberRepository.findByChat('some_chat_id');

      expect(result).toEqual([member]);
    });
  });

  describe('findByChatAndUser', () => {
    it('should return the member with the specified chat and user ids', async () => {
      const member = memberStub();

      const result = await memberRepository.findByChatAndUser('some_chat_id', 'some_user_id');

      expect(result).toEqual(member);
    });
  });

  describe('findByChatAndUsers', () => {
    it('should return the member with the specified chat id and user ids', async () => {
      const member = memberStub();

      const result = await memberRepository.findByChatAndUsers('some_chat_id', ['some_user_id']);

      expect(result).toEqual([member]);
    });
  });

  describe('updateById', () => {
    it('should update and return the member with the specified id', async () => {
      const member = memberStub();

      const result = await memberRepository.updateById(member.id, { status: MemberStatus.MUTED });

      expect(result).toEqual(member);
    });
  });
});