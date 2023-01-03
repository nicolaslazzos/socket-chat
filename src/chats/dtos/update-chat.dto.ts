import { IsEnum, IsString, IsOptional, IsDate } from 'class-validator';
import { ChatType } from '../entities/chat.entity';

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  @IsEnum(ChatType)
  type?: ChatType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  deletedBy?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}