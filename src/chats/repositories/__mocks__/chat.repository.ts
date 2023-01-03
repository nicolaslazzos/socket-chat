import { chatStub } from "../../test/chat.stub";

export const ChatRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(chatStub()),
  findById: jest.fn().mockResolvedValue(chatStub()),
  findByIds: jest.fn().mockResolvedValue([chatStub()]),
  findByTypeAndUsers: jest.fn().mockResolvedValue([chatStub()]),
  updateById: jest.fn().mockResolvedValue(chatStub()),
});