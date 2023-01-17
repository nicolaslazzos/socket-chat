import { chatStub } from "../../test/chat.stub";

export class ChatRepository {
  create = jest.fn().mockResolvedValue(chatStub());
  findById = jest.fn().mockResolvedValue(chatStub());
  findByUser = jest.fn().mockResolvedValue([chatStub()]);
  findByTypeAndUsers = jest.fn().mockResolvedValue([chatStub()]);
  updateById = jest.fn().mockResolvedValue(chatStub());
  addUsersById = jest.fn().mockResolvedValue(chatStub());
  removeUsersById = jest.fn().mockResolvedValue(chatStub());
}