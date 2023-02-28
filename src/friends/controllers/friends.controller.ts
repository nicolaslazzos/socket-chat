import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/get-user.decorator';
import { FriendsService } from '../services/friends.service';
import { Friend } from '../entities/friend.entity';

@Controller('friends')
@UseGuards(AuthGuard())
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) { }

  @Get()
  getFriends(@GetUser() user: User): Promise<Friend[]> {
    return this.friendsService.findByUser(user.id);
  }

  @Delete('/:friend')
  deleteFriend(@Param('friend') id: string, @GetUser() user: User): Promise<Friend> {
    return this.friendsService.deleteById(id, { deletedBy: user.id });
  }
}
