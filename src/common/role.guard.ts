import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { Chat } from 'src/chats/entities/chat.entity';
import { Member, MemberRole } from '../members/entities/member.entity';
import { ROLES_KEY, ROLES_VALUES } from './role.decorator';
import { MembersService } from '../members/services/members.service';
import { MessagesService } from 'src/messages/services/messages.service';
import { User } from 'src/auth/entities/user.entity';

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

    let messageId: string;
    let memberId: string;
    let chatId: string;

    let isOwner: boolean = false;

    let request = context.switchToHttp().getRequest();

    const user = request.user.id;

    if (request instanceof Socket) request = { body: context.switchToWs().getData(), headers: request.handshake.headers };

    const { params, body, query, headers } = request;

    messageId = params?.message ?? body?.message ?? query?.message ?? headers?.message;
    memberId = params?.member ?? body?.member ?? query?.member ?? headers?.member;
    chatId = params?.chat ?? body?.chat ?? query?.chat ?? headers?.chat;

    if (messageId) {
      const message = await this.messagesService.findById(messageId);

      isOwner = ((message?.member as Member)?.user as User).id === user;
      chatId = (message?.chat as Chat)?.id;
    } else if (memberId) {
      const member = await this.membersService.findById(memberId);

      isOwner = (member?.user as User)?.id === user;
      chatId = (member?.chat as Chat)?.id;
    }

    if (!chatId) return false;

    const member = await this.membersService.findByChatAndUser(chatId, user);

    isOwner = !isOwner ? (member.chat as Chat).creator === user : isOwner;

    if (isOwner) member.role = MemberRole.OWNER;

    return requiredRoles.some((role) => ROLES_VALUES[member.role] >= ROLES_VALUES[role]);
  }
}