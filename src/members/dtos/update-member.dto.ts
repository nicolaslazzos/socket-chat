import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { MemberRole } from '../entities/member.entity';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @IsEnum(MemberRole)
  role?: MemberRole;

  @IsOptional()
  @IsString()
  deletedBy?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}