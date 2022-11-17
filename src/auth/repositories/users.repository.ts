import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }

  async createUser(dto: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = dto;

      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      await this.userModel.create({ username, password: hashed });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (!user) throw new NotFoundException();

    return user;
  }
}
