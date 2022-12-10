import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { MemberRole } from './entities/member.entity';
import { ROLES_KEY, ROLES_VALUES } from './role.decorator';
import { MembersService } from './services/members.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly membersService: MembersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles?.length) return true;

    let chat: string;

    const request = context.switchToHttp().getRequest();

    if (request instanceof Socket) {
      chat = context.switchToWs().getData()?.chat ?? request.handshake.headers?.chat;
    } else {
      const { params, body, query, headers } = request;

      chat = params?.chat ?? body?.chat ?? query?.chat ?? headers?.chat;
    }

    if (!chat) return false;

    const user = context.switchToHttp().getRequest().user;

    const members = await this.membersService.findByChatAndUsers(chat, [user.id]);

    if (!members?.length) return false;

    return requiredRoles.some((role) => ROLES_VALUES[members[0].role] >= ROLES_VALUES[role]);
  }
}