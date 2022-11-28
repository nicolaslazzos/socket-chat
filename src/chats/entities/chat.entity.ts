import { User } from "../../auth/entities/user.entity";

export enum ChatType {
  DIRECT = 'direct',
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export class Chat {
  id: string;
  type?: ChatType;
  name?: string;
  creator: string | User;
  created: string;
  updated: string;

  constructor(partial: Partial<Chat>) {
    Object.assign(this, partial);
  }
}