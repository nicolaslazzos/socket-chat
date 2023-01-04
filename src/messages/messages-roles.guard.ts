import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberRole } from '../members/entities/member.entity';
import { MembersService } from '../members/services/members.service';
import { User } from '../auth/entities/user.entity';
import { RolesGuard } from '../common/roles.guard';
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

    const target = await this.messagesService.findById(messageId);

    if ((target?.user as User)?.id === userId) return MemberRole.OWNER;

    const member = await this.membersService.findByChatAndUser(target.chat as string, userId);

    return member?.role ?? null;
  }
}