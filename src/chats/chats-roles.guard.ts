import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberRole } from './entities/member.entity';
import { MembersService } from './services/members.service';
import { User } from '../auth/entities/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { ChatsService } from './services/chats.service';
import { ChatType } from './entities/chat.entity';

@Injectable()
export class ChatsRolesGuard extends RolesGuard {
  constructor(
    reflector: Reflector,
    private readonly membersService: MembersService,
    private readonly chatsService: ChatsService
  ) {
    super(reflector);
  }

  async getMemberRole({ userId, chatId, memberId }): Promise<MemberRole> {
    if (!chatId && !memberId) return null;

    if (memberId) {
      const member = await this.membersService.findById(memberId);

      if ((member?.user as User)?.id === userId) return MemberRole.OWNER;

      chatId = member?.chat as string;
    }

    const chat = await this.chatsService.findById(chatId);

    if ((chat?.owner as User)?.id === userId && chat.type !== ChatType.DIRECT) return MemberRole.OWNER;

    const member = await this.membersService.findByChatAndUser(chatId, userId);

    return member?.role ?? null;
  }
}