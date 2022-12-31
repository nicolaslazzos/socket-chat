import { Exclude } from 'class-transformer';

export class User {
  id: string;
  username: string;
  @Exclude()
  password: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}