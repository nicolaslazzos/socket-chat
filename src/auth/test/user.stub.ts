import { User } from "../entities/user.entity";

export const userStub = (options?: { name?: string; hashed?: boolean; }): User => {
  const { name, hashed } = { name: 'some', hashed: false, ...(options ?? {}) };

  return new User({
    id: `${name}_id`,
    username: `${name}_username`,
    password: hashed ? '$2b$10$XXpfSkO/4gwGpkWxUXRoeOaCeR.QSWY2Qmk3trpa3ZWoDmbOb/7xG' : `${name}_password`,
    updatedAt: new Date('2022-12-23').toISOString(),
    createdAt: new Date('2022-12-23').toISOString()
  });
};