import { Message } from "../entities/message.entity";

export const messageStub = (): Message => {
  return new Message({
    id: `some_id`,
    user: `some_user_id`,
    chat: 'some_chat_id',
    text: 'this is a message',
    updatedAt: new Date('2022-12-23').toISOString(),
    createdAt: new Date('2022-12-23').toISOString()
  });
};