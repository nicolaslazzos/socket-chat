import { IsString, IsOptional } from 'class-validator';

export class CreateFriendRequestDto {
  @IsOptional()
  @IsString()
  sender?: string;

  @IsString()
  receiver: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}