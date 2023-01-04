import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberRole } from '../members/entities/member.entity';
import { MembersService } from '../members/services/members.service';
import { User } from '../auth/entities/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { ChatsService } from './services/chats.service';

@Injectable()
export class ChatsRolesGuard extends RolesGuard {
  constructor(
    reflector: Reflector,
    private readonly membersService: MembersService,
    private readonly chatsService: ChatsService
  ) {
    super(reflector);
  }

  async getMemberRole({ userId, chatId }): Promise<MemberRole> {
    if (!chatId) return null;

    const target = await this.chatsService.findById(chatId);

    if ((target?.owner as User)?.id === userId) return MemberRole.OWNER;

    const member = await this.membersService.findByChatAndUser(target.id as string, userId);

    return member?.role ?? null;
  }
}