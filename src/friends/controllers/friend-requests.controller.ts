import { Controller, Post, Body, Get, Patch, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/get-user.decorator';
import { FriendRequestsService } from '../services/friend-requests.service';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { FriendRequest } from '../entities/friend-request.entity';
import { FindFriendRequestDto } from '../dtos/find-friend-requests.dto';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';

@Controller('friend-requests')
@UseGuards(AuthGuard())
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) { }

  @Post()
  createFriendRequest(@Body() dto: CreateFriendRequestDto, @GetUser() user: User): Promise<FriendRequest> {
    return this.friendRequestsService.create({ ...dto, sender: user.id, createdBy: user.id });
  }

  @Get()
  getFriendRequests(@GetUser() user: User, @Query() dto: FindFriendRequestDto): Promise<FriendRequest[]> {
    return this.friendRequestsService.findByUser(user.id, dto);
  }

  @Get('/:request')
  getFriendRequest(@Param('request') id: string): Promise<FriendRequest> {
    return this.friendRequestsService.findById(id);
  }

  @Patch('/:request')
  updateFriendRequest(@Param('request') id: string, @Body() dto: UpdateFriendRequestDto): Promise<FriendRequest> {
    return this.friendRequestsService.updateById(id, dto);
  }

  @Delete('/:request')
  deleteFriendRequest(@Param('request') id: string, @GetUser() user: User): Promise<FriendRequest> {
    return this.friendRequestsService.deleteById(id, { deletedBy: user.id } as UpdateFriendRequestDto);
  }
}
