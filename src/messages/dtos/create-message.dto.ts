import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  chat: string;

  @IsOptional()
  @IsString()
  member?: string;

  @IsString()
  text: string;
}