import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { FriendRequestRepository } from '../repositories/friend-request.repository';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { FriendRequest, FriendRequestStatus } from '../entities/friend-request.entity';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';
import { FindFriendRequestDto } from '../dtos/find-friend-requests.dto';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from '../dtos/create-friend.dto';

@Injectable()
export class FriendRequestsService {
  constructor(
    @Inject(FriendRequestRepository.name)
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly friendsService: FriendsService
  ) { }

  async create(dto: CreateFriendRequestDto): Promise<FriendRequest> {
    if (dto.sender === dto.receiver) throw new BadRequestException();

    const friends = await this.friendsService.findByUsers([dto.sender, dto.receiver]);

    if (friends) throw new ConflictException();

    const pending = await this.friendRequestRepository.findPendingRequest(dto.sender, dto.receiver);

    if (pending) throw new ConflictException();

    return this.friendRequestRepository.create(dto);
  }

  async findById(id: string): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestRepository.findById(id);

    if (!friendRequest) throw new NotFoundException();

    return friendRequest;
  }

  async findByUser(user: string, dto: FindFriendRequestDto): Promise<FriendRequest[]> {
    return this.friendRequestRepository.findByUser(user, dto);
  }

  async updateById(id: string, dto: UpdateFriendRequestDto): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestRepository.updateById(id, dto);

    if (!friendRequest) throw new NotFoundException();

    if (dto.status === FriendRequestStatus.ACCEPTED) {
      const { sender, receiver } = friendRequest;

      await this.friendsService.create({ users: [sender as string, receiver as string] });
    }

    return friendRequest;
  }

  async deleteById(id: string, dto: UpdateFriendRequestDto): Promise<FriendRequest> {
    return this.updateById(id, { ...dto, status: FriendRequestStatus.DELETED, deletedAt: new Date() });
  }
}
