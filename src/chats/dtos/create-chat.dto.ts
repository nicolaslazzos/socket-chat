import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsString, IsOptional, ValidateNested } from 'class-validator';
import { ChatType } from '../entities/chat.entity';
import { CreateMemberDto } from 'src/members/dtos/create-member.dto';

export class CreateChatDto {
  @IsString()
  @IsEnum(ChatType)
  type: ChatType;

  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  creator?: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateMemberDto)
  members: CreateMemberDto[];
}