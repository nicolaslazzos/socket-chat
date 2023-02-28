import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequestRepository } from './friend-request.repository';
import { FriendRequest as FriendRequestModel } from '../models/friend-request.model';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';
import { FriendRequest, FriendRequestStatus, FriendRequestType } from '../entities/friend-request.entity';
import { FindFriendRequestDto } from '../dtos/find-friend-requests.dto';

@Injectable()
export class FriendRequestMongoRepository extends FriendRequestRepository {
  constructor(
    @InjectModel(FriendRequestModel.name)
    private readonly friendRequestModel: Model<FriendRequestModel>
  ) {
    super();
  }

  async create(dto: CreateFriendRequestDto): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestModel.create(dto);

    return friendRequest.toEntity();
  }

  async findById(id: string): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestModel.findOne({ _id: id, deletedAt: { $exists: false } }).populate('sender receiver', '-password');

    return friendRequest ? friendRequest.toEntity() : null;
  }

  async findByUser(user: string, dto?: FindFriendRequestDto): Promise<FriendRequest[]> {
    const query: FilterQuery<FriendRequestModel> = { deletedAt: { $exists: false } };

    if (!dto.type) query.$or = [{ sender: user }, { receiver: user }];
    if (dto.type) query[dto.type === FriendRequestType.SENT ? 'sender' : 'receiver'] = user;
    if (dto.status) query.status = dto.status;

    const friendRequests = await this.friendRequestModel.find(query).populate('sender receiver', '-password').sort('-createdAt');

    return friendRequests.map((friendRequest) => friendRequest.toEntity());
  }

  async findByUserAndStatus(user: string, type: FriendRequestType, status: FriendRequestStatus): Promise<FriendRequest[]> {
    const as = type === FriendRequestType.SENT ? 'sender' : 'receiver';

    const friendRequests = await this.friendRequestModel.find({ [as]: user, status }).populate('users owner', '-password').sort('-createdAt');

    return friendRequests.map((friendRequest) => friendRequest.toEntity());
  }

  async updateById(id: string, dto: UpdateFriendRequestDto): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestModel.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, dto, { new: true });

    return friendRequest ? friendRequest.toEntity() : null;
  }

  async findPendingRequest(sender: string, receiver: string): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestModel.findOne({ sender, receiver, status: FriendRequestStatus.CREATED });

    return friendRequest ? friendRequest.toEntity() : null;
  }
}
