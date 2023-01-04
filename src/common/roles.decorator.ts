import { SetMetadata } from '@nestjs/common';
import { MemberRole } from '../members/entities/member.entity';

export const ROLES_KEY = 'roles';
export const ROLES_VALUES = { [MemberRole.OWNER]: 3, [MemberRole.ADMIN]: 2, [MemberRole.MEMBER]: 1 };
export const Roles = (...roles: MemberRole[]) => SetMetadata(ROLES_KEY, roles);