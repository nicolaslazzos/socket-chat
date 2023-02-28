import { IsDate, IsOptional, IsString } from 'class-validator';

export class DeleteFriendDto {
  @IsString()
  deletedBy: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}