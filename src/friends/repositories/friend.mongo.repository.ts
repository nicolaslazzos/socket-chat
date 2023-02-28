import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Friend as FriendModel } from '../models/friend.model';
import { FriendRepository } from './friend.repository';
import { CreateFriendDto } from '../dtos/create-friend.dto';
import { Friend } from '../entities/friend.entity';
import { DeleteFriendDto } from '../dtos/delete-friend.dto';

@Injectable()
export class FriendMongoRepository extends FriendRepository {
  constructor(
    @InjectModel(FriendModel.name)
    private readonly friendModel: Model<FriendModel>
  ) {
    super();
  }

  async create(dto: CreateFriendDto): Promise<Friend> {
    const friend = await this.friendModel.create(dto);

    return friend.toEntity();
  }

  async findByUser(user: string): Promise<Friend[]> {
    const friends = await this.friendModel.find({ users: user, deletedAt: { $exists: false } }).populate('users', '-password');

    return friends.map((friend) => friend.toEntity());
  }

  async findByUsers(users: [string, string]): Promise<Friend> {
    const friend = await this.friendModel.findOne({ users: { $all: users }, deletedAt: { $exists: false } });

    return friend ? friend.toEntity() : null;
  }

  async deleteById(id: string, dto: DeleteFriendDto): Promise<Friend> {
    const friend = await this.friendModel.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, dto, { new: true });

    return friend ? friend.toEntity() : null;
  }
}
