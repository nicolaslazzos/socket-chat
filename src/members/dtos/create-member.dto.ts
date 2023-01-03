import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MemberRole } from '../entities/member.entity';

export class CreateMemberDto {
  @IsString()
  @IsEnum(MemberRole)
  role: MemberRole;

  @IsOptional()
  @IsString()
  chat?: string;

  @IsString()
  user: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}