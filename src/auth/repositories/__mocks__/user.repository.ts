import { userStub } from "../../test/user.stub";

export const UserRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  findByUsername: jest.fn().mockResolvedValue(userStub())
});