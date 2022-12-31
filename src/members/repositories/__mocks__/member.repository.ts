import { memberStub } from "../../test/member.stub";

export const MemberRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(memberStub()),
  createMany: jest.fn().mockResolvedValue([memberStub()]),
  findById: jest.fn().mockResolvedValue(memberStub()),
  findByUser: jest.fn().mockResolvedValue([memberStub()]),
  findByChat: jest.fn().mockResolvedValue([memberStub()]),
  findByChatAndUser: jest.fn().mockResolvedValue(memberStub()),
  findByChatAndUsers: jest.fn().mockResolvedValue([memberStub()]),
  updateById: jest.fn().mockResolvedValue(memberStub()),
});