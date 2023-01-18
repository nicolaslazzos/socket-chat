import { messageStub } from "../../test/message.stub";

export class MessageRepository {
  create = jest.fn().mockResolvedValue(messageStub());
  findById = jest.fn().mockResolvedValue(messageStub());
  findByUser = jest.fn().mockResolvedValue([messageStub()]);
  findByChat = jest.fn().mockResolvedValue([messageStub()]);
  updateById = jest.fn().mockResolvedValue(messageStub());
}