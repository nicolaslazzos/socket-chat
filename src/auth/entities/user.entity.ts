import { Exclude } from 'class-transformer';

export class User {
  id: string;
  username: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    delete partial.password;
    Object.assign(this, partial);
  }
}