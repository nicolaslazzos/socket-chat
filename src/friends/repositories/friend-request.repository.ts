import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { FindFriendRequestDto } from '../dtos/find-friend-requests.dto';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';
import { FriendRequest } from '../entities/friend-request.entity';

export abstract class FriendRequestRepository {
  public abstract create(dto: CreateFriendRequestDto): Promise<FriendRequest>;
  public abstract findById(id: string): Promise<FriendRequest>;
  public abstract findByUser(user: string, dto?: FindFriendRequestDto): Promise<FriendRequest[]>;
  public abstract findPendingRequest(sender: string, receiver: string): Promise<FriendRequest>;
  public abstract updateById(id: string, dto: UpdateFriendRequestDto): Promise<FriendRequest>;
}
