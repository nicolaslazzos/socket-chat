import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { FriendRepository } from '../repositories/friend.repository';
import { CreateFriendDto } from '../dtos/create-friend.dto';
import { Friend } from '../entities/friend.entity';
import { DeleteFriendDto } from '../dtos/delete-friend.dto';

@Injectable()
export class FriendsService {
  constructor(
    @Inject(FriendRepository.name)
    private readonly friendRepository: FriendRepository
  ) { }

  async create(dto: CreateFriendDto): Promise<Friend> {
    if (new Set(dto.users).size < 2) throw new BadRequestException();

    const friends = await this.findByUsers(dto.users as [string, string]);

    if (friends) throw new ConflictException();

    return this.friendRepository.create(dto);
  }

  async findByUser(user: string): Promise<Friend[]> {
    return this.friendRepository.findByUser(user);
  }

  async findByUsers(users: [string, string]): Promise<Friend> {
    return this.friendRepository.findByUsers(users);
  }

  async deleteById(id: string, dto: DeleteFriendDto): Promise<Friend> {
    const friend = await this.friendRepository.deleteById(id, { ...dto, deletedAt: new Date() });

    if (!friend) throw new NotFoundException();

    return friend;
  }
}
