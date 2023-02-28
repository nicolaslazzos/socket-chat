import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { FriendRequestStatus } from '../entities/friend-request.entity';

export class UpdateFriendRequestDto {
  @IsOptional()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;

  @IsOptional()
  @IsString()
  deletedBy?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}