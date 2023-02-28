import { CreateFriendDto } from '../dtos/create-friend.dto';
import { DeleteFriendDto } from '../dtos/delete-friend.dto';
import { Friend } from '../entities/friend.entity';

export abstract class FriendRepository {
  public abstract create(dto: CreateFriendDto): Promise<Friend>;
  public abstract findByUser(user: string): Promise<Friend[]>;
  public abstract findByUsers(users: [string, string]): Promise<Friend>;
  public abstract deleteById(id: string, dto: DeleteFriendDto): Promise<Friend>;
}
