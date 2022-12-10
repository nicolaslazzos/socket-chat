import { Chat } from "../../chats/entities/chat.entity";
import { User } from "../../auth/entities/user.entity";

export class Message {
  id: string;
  chat: string | Chat;
  user: string | User;
  message: string;
  created: string;
  updated: string;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
}