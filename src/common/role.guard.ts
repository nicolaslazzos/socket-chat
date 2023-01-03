import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { Chat } from '../chats/entities/chat.entity';
import { Member, MemberRole } from '../members/entities/member.entity';
import { ROLES_KEY, ROLES_VALUES } from './role.decorator';
import { MembersService } from '../members/services/members.service';
import { MessagesService } from '../messages/services/messages.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly membersService: MembersService,
    private readonly messagesService: MessagesService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles?.length) return true;

    let request = context.switchToHttp().getRequest();
    let messageId: string;
    let memberId: string;
    let chatId: string;
    let owner: boolean;

    const user = request.user.id;

    if (request instanceof Socket) request = { body: context.switchToWs().getData(), headers: request.handshake.headers };

    const { params, body, query, headers } = request;

    messageId = params?.message ?? body?.message ?? query?.message ?? headers?.message;
    memberId = params?.member ?? body?.member ?? query?.member ?? headers?.member;
    chatId = params?.chat ?? body?.chat ?? query?.chat ?? headers?.chat;

    if (messageId) {
      const message = await this.messagesService.findById(messageId);

      owner = (message?.user as User).id === user;
      chatId = message?.chat as string;
    } else if (memberId) {
      const member = await this.membersService.findById(memberId);

      owner = (member?.user as User)?.id === user;
      chatId = member?.chat as string;
    }

    if (!chatId) return false;

    const member = await this.membersService.findByChatAndUser(chatId, user);

    owner = owner ?? (member.chat as Chat).owner === user;

    if (owner) member.role = MemberRole.OWNER;

    return requiredRoles.some((role) => ROLES_VALUES[member.role] >= ROLES_VALUES[role]);
  }
}