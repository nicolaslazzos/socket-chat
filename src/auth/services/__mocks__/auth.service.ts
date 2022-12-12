import { userStub } from "../../test/user.stub";
import { accessTokenStub } from "../../test/access-token.stub";

export const AuthService = jest.fn().mockReturnValue({
  signUp: jest.fn().mockResolvedValue(userStub()),
  signIn: jest.fn().mockResolvedValue(accessTokenStub())
});