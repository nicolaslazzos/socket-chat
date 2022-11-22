import { IsEnum, IsString } from 'class-validator';
import { MemberType } from '../entities/member.entity';

export class CreateMemberDto {
  @IsString()
  @IsEnum(MemberType)
  type: MemberType;

  @IsString()
  chat: string;

  @IsString()
  user: string;
}