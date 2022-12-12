import { User } from "../entities/user.entity";

export const userStub = (): User => {
  return new User({
    id: 'some_id',
    username: 'some_username',
    password: 'some_password'
  });
};