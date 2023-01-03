import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  deletedBy?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}