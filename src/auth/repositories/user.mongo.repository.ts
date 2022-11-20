import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { User as UserModel } from '../models/user.model';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

@Injectable()
export class UserMongoRepository extends UserRepository {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>
  ) {
    super();
  }

  async create(dto: AuthCredentialsDto): Promise<User> {
    try {
      const { username, password } = dto;

      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      const user = await this.userModel.create({ username, password: hashed });

      return user.toEntity();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (!user) throw new NotFoundException();

    return user.toEntity();
  }
}
