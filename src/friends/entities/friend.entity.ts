import { User } from "../../auth/entities/user.entity";

export class Friend {
  id: string;
  users: [string | User, string | User];
  deletedBy?: string | User;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Friend>) {
    Object.assign(this, partial);
  }
}