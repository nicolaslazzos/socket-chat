import { User } from "../entities/user.entity";

export const userStub = (): User => {
  return new User({
    id: 'some_id',
    username: 'some_username',
    password: '$2b$10$XXpfSkO/4gwGpkWxUXRoeOaCeR.QSWY2Qmk3trpa3ZWoDmbOb/7xG' // some_password
  });
};