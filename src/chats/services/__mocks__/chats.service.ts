import { chatStub } from "../../test/chat.stub";

export const ChatsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(chatStub()),
  findById: jest.fn().mockResolvedValue(chatStub()),
  findByUser: jest.fn().mockResolvedValue([chatStub()]),
  updateById: jest.fn().mockResolvedValue(chatStub()),
  deleteById: jest.fn().mockResolvedValue(chatStub()),
});