import { User } from "../../auth/entities/user.entity";
import { Chat } from './chat.entity';

export enum MemberType {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

export class Member {
  id: string;
  type: MemberType;
  user: string | User;
  chat: string | Chat;
  created: string;
  updated: string;

  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
}