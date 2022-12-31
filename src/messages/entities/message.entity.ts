import { Chat } from "../../chats/entities/chat.entity";
import { Member } from "../../members/entities/member.entity";

export enum MessageStatus {
  ACTIVE = 'active',
  DELETED = 'deleted'
}

export class Message {
  id: string;
  status: MessageStatus;
  chat: string | Chat;
  member: string | Member;
  text: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
}