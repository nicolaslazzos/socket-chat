import { User } from "../../auth/entities/user.entity";
import { Chat } from "../../chats/entities/chat.entity";

export class Message {
  id: string;
  chat: string | Chat;
  user: string | User;
  text: string;
  deletedBy?: string | User;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
}