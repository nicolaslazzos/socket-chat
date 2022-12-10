import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { Chat } from 'src/chats/entities/chat.entity';
import { MemberRole } from '../members/entities/member.entity';
import { ROLES_KEY, ROLES_VALUES } from './role.decorator';
import { MembersService } from '../members/services/members.service';
import { MessagesService } from 'src/messages/services/messages.service';

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

    let message: string;
    let member: string;
    let chat: string;

    const request = context.switchToHttp().getRequest();

    if (request instanceof Socket) {
      member = context.switchToWs().getData()?.member ?? request.handshake.headers?.member;
      chat = context.switchToWs().getData()?.chat ?? request.handshake.headers?.chat;
    } else {
      const { params, body, query, headers } = request;

      message = params?.message ?? query?.message ?? headers?.message;
      member = params?.member ?? body?.member ?? query?.member ?? headers?.member;
      chat = params?.chat ?? body?.chat ?? query?.chat ?? headers?.chat;
    }

    if (message) {
      // if a message involved in the action, get the chat from it
      const m = await this.messagesService.findById(message);

      chat = (m?.chat as Chat)?.id;
    } else if (member) {
      // if a member involved in the action, get the chat from it
      const m = await this.membersService.findById(member);

      chat = (m?.chat as Chat)?.id;
    }

    if (!chat) return false;

    const members = await this.membersService.findByChatAndUsers(chat, [request.user.id]);

    if (!members?.length) return false;

    return requiredRoles.some((role) => ROLES_VALUES[members[0].role] >= ROLES_VALUES[role]);
  }
}