import { User } from "../../auth/entities/user.entity";

export enum ChatType {
  DIRECT = 'direct',
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export enum ChatStatus {
  ACTIVE = 'active',
  DELETED = 'deleted'
}

export class Chat {
  id: string;
  type: ChatType;
  status: ChatStatus;
  name?: string;
  creator: string | User;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Chat>) {
    Object.assign(this, partial);
  }
}