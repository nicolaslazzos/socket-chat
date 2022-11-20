import { Exclude } from 'class-transformer';

export class User {
  id: string;
  username: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}