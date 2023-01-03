import { User } from "../../auth/entities/user.entity";
import { Chat } from '../../chats/entities/chat.entity';

export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

export class Member {
  id: string;
  role: MemberRole;
  user: string | User;
  chat: string | Chat;
  muted: boolean;
  createdBy?: string | User;
  deletedBy?: string | User;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
}