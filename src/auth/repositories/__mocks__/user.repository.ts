import { userStub } from "../../test/user.stub";

export const UserRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub({ hashed: true })),
  findByUsername: jest.fn().mockResolvedValue(userStub({ hashed: true }))
});