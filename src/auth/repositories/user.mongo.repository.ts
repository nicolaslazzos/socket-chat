import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { UserDefinition } from '../models/user.model';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

@Injectable()
export class UserMongoRepository extends UserRepository {
  constructor(
    @InjectModel(UserDefinition.name)
    private readonly userModel: Model<UserDefinition>
  ) {
    super();
  }

  async create(dto: AuthCredentialsDto): Promise<void> {
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

    return user.toEntity();
  }
}
