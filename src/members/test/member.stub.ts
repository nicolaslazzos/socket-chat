import { Member, MemberRole, MemberStatus } from "../entities/member.entity";

export const memberStub = (): Member => {
  return new Member({
    id: `some_id`,
    role: MemberRole.MEMBER,
    status: MemberStatus.ACTIVE,
    user: `some_user_id`,
    chat: 'some_chat_id',
    updatedAt: new Date('2022-12-23').toISOString(),
    createdAt: new Date('2022-12-23').toISOString()
  });
};