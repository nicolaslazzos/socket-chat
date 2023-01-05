import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsString, IsOptional, ValidateNested } from 'class-validator';
import { ChatType } from '../entities/chat.entity';
import { CreateMemberDto } from './create-member.dto';

export class CreateChatDto {
  @IsString()
  @IsEnum(ChatType)
  type: ChatType;

  @IsOptional()
  @IsString()
  name?: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateMemberDto)
  members: CreateMemberDto[];

  @IsOptional()
  @ArrayNotEmpty()
  @IsString({ each: true })
  users?: string[];

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}