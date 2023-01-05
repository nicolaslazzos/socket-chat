import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberRole } from '../chats/entities/member.entity';
import { MembersService } from '../chats/services/members.service';
import { User } from '../auth/entities/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { MessagesService } from './services/messages.service';

@Injectable()
export class MessagesRolesGuard extends RolesGuard {
  constructor(
    reflector: Reflector,
    private readonly messagesService: MessagesService,
    private readonly membersService: MembersService,
  ) {
    super(reflector);
  }

  async getMemberRole({ userId, messageId }): Promise<MemberRole> {
    if (!messageId) return null;

    const message = await this.messagesService.findById(messageId);

    if ((message?.user as User)?.id === userId) return MemberRole.OWNER;

    const member = await this.membersService.findByChatAndUser(message.chat as string, userId);

    return member?.role ?? null;
  }
}