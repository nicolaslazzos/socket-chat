import { User } from "../../auth/entities/user.entity";

export enum ChatType {
  DIRECT = 'direct',
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export class Chat {
  id: string;
  type: ChatType;
  name?: string;
  users: string[] | User[];
  owner?: string | User;
  createdBy?: string | User;
  deletedBy?: string | User;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Chat>) {
    Object.assign(this, partial);
  }
}