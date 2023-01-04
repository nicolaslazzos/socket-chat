import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { MemberRole } from '../../members/entities/member.entity';
import { ROLES_KEY, ROLES_VALUES } from '../decorators/roles.decorator';

@Injectable()
export abstract class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  abstract getMemberRole(params: { userId: string, chatId?: string, memberId?: string, messageId?: string; }): Promise<MemberRole>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles?.length) return true;

    let request = context.switchToHttp().getRequest();

    if (request instanceof Socket) request = { body: context.switchToWs().getData(), headers: request.handshake.headers };

    const { params, body, query, headers } = request;

    const role = await this.getMemberRole({
      userId: request.user.id,
      chatId: params?.chat ?? body?.chat ?? query?.chat ?? headers?.chat,
      memberId: params?.member ?? body?.member ?? query?.member ?? headers?.member,
      messageId: params?.message ?? body?.message ?? query?.message ?? headers?.message,
    });

    if (!role) return false;

    return requiredRoles.some((required) => ROLES_VALUES[role] >= ROLES_VALUES[required]);
  }
}