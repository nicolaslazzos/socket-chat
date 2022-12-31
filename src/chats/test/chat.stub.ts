import { Chat, ChatType, ChatStatus } from "../entities/chat.entity";

export const chatStub = (): Chat => {
  return new Chat({
    id: `some_id`,
    type: ChatType.DIRECT,
    status: ChatStatus.ACTIVE,
    name: `some_name`,
    creator: `some_creator`,
    updatedAt: new Date('2022-12-23').toISOString(),
    createdAt: new Date('2022-12-23').toISOString()
  });
};