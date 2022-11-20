import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  chat: string;

  @IsString()
  user: string;

  @IsString()
  message: string;
}