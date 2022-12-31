import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { User as UserModel } from '../models/user.model';
import { User } from '../entities/user.entity';
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
    const user = await this.userModel.create(dto);

    return user.toEntity();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    return user ? user.toEntity() : null;
  }
}
