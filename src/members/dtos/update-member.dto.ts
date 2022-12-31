import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { MemberRole, MemberStatus } from '../entities/member.entity';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @IsEnum(MemberRole)
  role?: MemberRole;

  @IsOptional()
  @IsString()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}