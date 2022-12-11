import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ChatStatus, ChatType } from '../entities/chat.entity';

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  @IsEnum(ChatType)
  type?: ChatType;

  @IsOptional()
  @IsString()
  @IsEnum(ChatStatus)
  status?: ChatStatus;

  @IsOptional()
  @IsString()
  name?: string;
}