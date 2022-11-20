import { ArrayNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';
import { ChatType } from '../entities/chat.entity';

export class CreateChatDto {
  @IsString()
  @IsEnum(ChatType)
  type: ChatType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  creator: string;

  @ArrayNotEmpty()
  @IsString({ each: true })
  users: string[];
}