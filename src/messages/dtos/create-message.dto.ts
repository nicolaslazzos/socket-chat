import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  chat: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsString()
  text: string;
}