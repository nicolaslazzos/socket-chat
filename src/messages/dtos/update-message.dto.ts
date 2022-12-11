import { IsOptional, IsString } from 'class-validator';
import { MessageStatus } from '../entities/message.entity';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  status?: MessageStatus;

  @IsOptional()
  @IsString()
  text?: string;
}