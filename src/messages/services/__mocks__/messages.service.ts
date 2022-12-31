import { messageStub } from "../../test/message.stub";

export const MessagesService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(messageStub()),
  findById: jest.fn().mockResolvedValue(messageStub()),
  findByChat: jest.fn().mockResolvedValue([messageStub()]),
  updateById: jest.fn().mockResolvedValue(messageStub()),
  deleteById: jest.fn().mockResolvedValue(messageStub()),
});