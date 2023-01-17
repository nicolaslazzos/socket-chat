import { userStub } from "../../test/user.stub";

export class UserRepository {
  create = jest.fn().mockResolvedValue(userStub({ hashed: true }));
  findByUsername = jest.fn().mockResolvedValue(userStub({ hashed: true }));
}