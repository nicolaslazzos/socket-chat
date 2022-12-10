import { User } from "../../auth/entities/user.entity";
import { Chat } from '../../chats/entities/chat.entity';

export enum MemberRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

export enum MemberStatus {
  ACTIVE = 'active',
  MUTED = 'muted',
  DELETED = 'deleted'
}

export class Member {
  id: string;
  role: MemberRole;
  status: MemberStatus;
  user: string | User;
  chat: string | Chat;
  created: string;
  updated: string;

  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
}