import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { MembersService } from '../services/members.service';
import { userStub } from '../../auth/test/user.stub';
import { MemberRole } from '../entities/member.entity';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { ChatType } from '../entities/chat.entity';
import { ChatsService } from '../services/chats.service';
import { chatStub } from '../test/chat.stub';
import { ChatsController } from './chats.controller';
import { MessagesService } from '../../messages/services/messages.service';
import { AuthStrategy } from '../../auth/constants';
import { UpdateChatDto } from '../dtos/update-chat.dto';

jest.mock('../services/chats.service');
jest.mock('../services/members.service');
jest.mock('../../messages/services/messages.service');

describe('ChatsController', () => {
  let chatsController: ChatsController;
  let chatsService: ChatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      // i know i should not use imports in testing modules, but if not, it throws an error
      imports: [PassportModule.register({ defaultStrategy: AuthStrategy.JWT })],
      controllers: [ChatsController],
      providers: [ChatsService, MembersService, MessagesService],
    }).compile();

    chatsController = moduleRef.get<ChatsController>(ChatsController);
    chatsService = moduleRef.get<ChatsService>(ChatsService);

    jest.clearAllMocks();
  });

  describe('createChat', () => {
    it('should return the chat created by the service', async () => {
      const chat = chatStub();
      const user = userStub();

      const dto: CreateChatDto = {
        type: ChatType.PRIVATE,
        name: 'some_name',
        members: [
          { user: user.id, role: MemberRole.ADMIN },
          { user: 'some_user_id', role: MemberRole.MEMBER }
        ]
      };

      const result = await chatsController.createChat(dto, user);

      expect(result).toEqual(chat);
      expect(chatsService.create).toHaveBeenCalled();
    });
  });

  describe('getChats', () => {
    it('should return the list of chats in which the requesting user is a memeber', async () => {
      const chat = chatStub();
      const user = userStub();

      const result = await chatsController.getChats(user);

      expect(result).toEqual([chat]);
      expect(chatsService.findByUser).toHaveBeenCalledWith(user.id);
    });
  });

  describe('getChat', () => {
    it('should return the chat with the specified id', async () => {
      const chat = chatStub();

      const result = await chatsController.getChat(chat.id);

      expect(result).toEqual(chat);
      expect(chatsService.findById).toHaveBeenCalledWith(chat.id);
    });
  });

  describe('updateChat', () => {
    it('should return the updated chat with the specified id', async () => {
      const chat = chatStub();

      const dto: UpdateChatDto = { name: 'new_name' };

      const result = await chatsController.updateChat(chat.id, dto);

      expect(result).toEqual(chat);
      expect(chatsService.updateById).toHaveBeenCalledWith(chat.id, dto);
    });
  });

  describe('deleteChat', () => {
    it('should return the chat with the specified id marked as deleted', async () => {
      const chat = chatStub();
      const user = userStub();

      const result = await chatsController.deleteChat(chat.id, user);

      expect(result).toEqual(chat);
      expect(chatsService.deleteById).toHaveBeenCalled();
    });
  });
});