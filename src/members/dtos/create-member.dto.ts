import { IsEnum, IsString } from 'class-validator';
import { MemberRole } from '../entities/member.entity';

export class CreateMemberDto {
  @IsString()
  @IsEnum(MemberRole)
  role: MemberRole;

  @IsString()
  chat: string;

  @IsString()
  user: string;
}