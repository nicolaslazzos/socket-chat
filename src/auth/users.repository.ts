import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(dto: AuthCredentialsDto): Promise<void> {
    const { username, password } = dto;

    try {
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      const user = this.create({ username, password: hashed });

      await this.save(user);
    } catch (e) {
      const errors = { 23505: 'A user with the same username already exists' };

      if (errors[e.code]) throw new ConflictException(errors[e.code]);

      throw new InternalServerErrorException();
    }
  }
}
