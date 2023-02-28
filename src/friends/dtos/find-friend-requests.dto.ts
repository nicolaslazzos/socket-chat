import { IsOptional, IsEnum } from 'class-validator';
import { FriendRequestStatus, FriendRequestType } from '../entities/friend-request.entity';

export class FindFriendRequestDto {
  @IsOptional()
  @IsEnum(FriendRequestType)
  type?: FriendRequestType;

  @IsOptional()
  @IsEnum(FriendRequestStatus)
  status?: FriendRequestStatus;
}