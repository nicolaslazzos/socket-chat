import { Chat, ChatType } from "../entities/chat.entity";

export const chatStub = (): Chat => {
  return new Chat({
    id: `some_id`,
    type: ChatType.DIRECT,
    name: `some_name`,
    owner: `some_user_id`,
    createdBy: `some_user_id`,
    users: [`some_user_id`, `other_user_id`],
    updatedAt: new Date('2022-12-23').toISOString(),
    createdAt: new Date('2022-12-23').toISOString()
  });
};