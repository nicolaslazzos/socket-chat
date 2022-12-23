import { User } from "../entities/user.entity";

export const userStub = (options?: { name?: string; hashed?: boolean; }): User => {
  const { name, hashed } = { name: 'some', hashed: true, ...(options ?? {}) };

  return new User({
    id: `${name}_id`,
    username: `${name}_username`,
    password: hashed !== false ? '$2b$10$XXpfSkO/4gwGpkWxUXRoeOaCeR.QSWY2Qmk3trpa3ZWoDmbOb/7xG' : 'some_password'
  });
};