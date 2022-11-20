import { User } from "../../auth/entities/user.entity";

export class Message {
  id: string;
  chat: string;
  user: string | User;
  message: string;
  created: string;
  updated: string;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
}