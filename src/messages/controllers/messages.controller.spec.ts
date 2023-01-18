import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { userStub } from '../../auth/test/user.stub';
import { messageStub } from '../test/message.stub';
import { MessagesController } from './messages.controller';
import { MessagesService } from '../services/messages.service';
import { MembersService } from '../../chats/services/members.service';
import { AuthStrategy } from '../../auth/constants';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';

jest.mock('../services/messages.service');
jest.mock('../../chats/services/members.service');

describe('MessagesController', () => {
  let messagesController: MessagesController;
  let messagesService: MessagesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      // i know i should not use imports in testing modules, but if not, it throws an error
      imports: [PassportModule.register({ defaultStrategy: AuthStrategy.JWT })],
      controllers: [MessagesController],
      providers: [MessagesService, MembersService],
    }).compile();

    messagesController = moduleRef.get<MessagesController>(MessagesController);
    messagesService = moduleRef.get<MessagesService>(MessagesService);

    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should return the message created by the service', async () => {
      const message = messageStub();
      const user = userStub();

      const dto: CreateMessageDto = {
        chat: message.chat as string,
        text: message.text,
        user: user.id
      };

      const result = await messagesController.createMessage(user, dto);

      expect(result).toEqual(message);
      expect(messagesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getMessages', () => {
    it('should return the list of messages of the specified chat', async () => {
      const message = messageStub();

      const chat = message.chat as string;

      const result = await messagesController.getMessages(chat);

      expect(result).toEqual([message]);
      expect(messagesService.findByChat).toHaveBeenCalledWith(chat);
    });
  });

  describe('getMessage', () => {
    it('should return the message with the specified id', async () => {
      const message = messageStub();

      const result = await messagesController.getMessage(message.id);

      expect(result).toEqual(message);
      expect(messagesService.findById).toHaveBeenCalledWith(message.id);
    });
  });

  describe('updateMessage', () => {
    it('should return the updated message with the specified id', async () => {
      const message = messageStub();

      const dto: UpdateMessageDto = { text: 'this is an updated message' };

      const result = await messagesController.updateMessage(message.id, dto);

      expect(result).toEqual(message);
      expect(messagesService.updateById).toHaveBeenCalledWith(message.id, dto);
    });
  });

  describe('deleteMessage', () => {
    it('should return the message with the specified id marked as deleted', async () => {
      const message = messageStub();
      const user = userStub();

      const result = await messagesController.deleteMessage(message.id, user);

      expect(result).toEqual(message);
      expect(messagesService.deleteById).toBeCalledWith(message.id, { deletedBy: user.id });
    });
  });
});