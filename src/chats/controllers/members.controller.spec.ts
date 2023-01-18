import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { userStub } from '../../auth/test/user.stub';
import { AuthStrategy } from '../../auth/constants';
import { MembersService } from '../services/members.service';
import { MemberRole } from '../entities/member.entity';
import { MembersController } from './members.controller';
import { memberStub } from '../test/member.stub';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { ChatsService } from '../services/chats.service';

jest.mock('../services/members.service');
jest.mock('../services/chats.service');

describe('MembersController', () => {
  let membersController: MembersController;
  let membersService: MembersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      // i know i should not use imports in testing modules, but if not, it throws an error
      imports: [PassportModule.register({ defaultStrategy: AuthStrategy.JWT })],
      controllers: [MembersController],
      providers: [MembersService, ChatsService],
    }).compile();

    membersController = moduleRef.get<MembersController>(MembersController);
    membersService = moduleRef.get<MembersService>(MembersService);

    jest.clearAllMocks();
  });

  describe('createMembers', () => {
    it('should return the list of members created by the service', async () => {
      const member = memberStub();

      const chat: string = 'some_chat_id';
      const members: CreateMemberDto[] = [{ role: MemberRole.MEMBER, user: 'some_user_id' }];

      const result = await membersController.createMembers({ chat, members });

      expect(result).toEqual([member]);
      expect(membersService.create).toHaveBeenCalledWith(chat, members);
    });
  });

  describe('getMembers', () => {
    it('should return the list of members of the specified chat', async () => {
      const member = memberStub();

      const chat: string = 'some_chat_id';

      const result = await membersController.getMembers(chat);

      expect(result).toEqual([member]);
      expect(membersService.findByChat).toHaveBeenCalledWith(chat);
    });
  });

  describe('getMember', () => {
    it('should return the member with the specified id', async () => {
      const member = memberStub();

      const result = await membersController.getMember(member.id);

      expect(result).toEqual(member);
      expect(membersService.findById).toHaveBeenCalledWith(member.id);
    });
  });

  describe('updateMember', () => {
    it('should return the updated member with the specified id', async () => {
      const member = memberStub();

      const dto: UpdateMemberDto = { role: MemberRole.ADMIN };

      const result = await membersController.updateMember(member.id, dto);

      expect(result).toEqual(member);
      expect(membersService.updateById).toHaveBeenCalledWith(member.id, dto);
    });
  });

  describe('deleteMember', () => {
    it('should return the member with the specified id marked as deleted', async () => {
      const user = userStub();
      const member = memberStub();

      const result = await membersController.deleteMember(member.id, user);

      expect(result).toEqual(member);
      expect(membersService.deleteById).toHaveBeenCalledWith(member.id, { deletedBy: user.id });
    });
  });
});