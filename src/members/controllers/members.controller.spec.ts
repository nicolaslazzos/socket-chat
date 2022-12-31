import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { MembersService } from '../../members/services/members.service';
import { userStub } from '../../auth/test/user.stub';
import { MemberRole, MemberStatus } from '../../members/entities/member.entity';
import { MembersController } from './members.controller';
import { MessagesService } from '../../messages/services/messages.service';
import { AuthStrategy } from '../../auth/constants';
import { memberStub } from '../test/member.stub';
import { CreateMemberDto } from '../dtos/create-member.dto';

// jest.mock('../services/chats.service');
jest.mock('../services/members.service');
jest.mock('../../messages/services/messages.service');

describe('MembersController', () => {
  let membersController: MembersController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      // i know i should not use imports in testing modules, but if not, it throws an error
      imports: [PassportModule.register({ defaultStrategy: AuthStrategy.JWT })],
      controllers: [MembersController],
      providers: [MembersService, MessagesService],
    }).compile();

    membersController = moduleRef.get<MembersController>(MembersController);

    jest.clearAllMocks();
  });

  describe('createMembers', () => {
    it('should return the list of members created by the service', async () => {
      const member = memberStub();

      const dto: CreateMemberDto = { role: MemberRole.MEMBER, user: 'some_user_id' };

      const result = await membersController.createMembers({ chat: 'some_chat_id', members: [dto] });

      expect(result).toEqual([member]);
    });
  });

  describe('getMembers', () => {
    it('should return the list of members of the specified chat', async () => {
      const member = memberStub();

      const result = await membersController.getMembers('some_chat_id');

      expect(result).toEqual([member]);
    });
  });

  describe('getMember', () => {
    it('should return the member with the specified id', async () => {
      const member = memberStub();

      const result = await membersController.getMember(member.id);

      expect(result).toEqual(member);
    });
  });

  describe('updateMember', () => {
    it('should return the updated member with the specified id', async () => {
      const member = memberStub();

      const result = await membersController.updateMember(member.id, { status: MemberStatus.MUTED });

      expect(result).toEqual(member);
    });
  });

  describe('deleteMember', () => {
    it('should return the member with the specified id marked as deleted', async () => {
      const member = memberStub();

      const result = await membersController.deleteMember(member.id);

      expect(result).toEqual(member);
    });
  });
});