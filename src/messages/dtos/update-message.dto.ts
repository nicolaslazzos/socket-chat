import { IsDate, IsOptional, IsString } from 'class-validator';
import { MessageStatus } from '../entities/message.entity';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  status?: MessageStatus;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}