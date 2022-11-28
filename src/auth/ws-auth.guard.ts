import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';
import { AuthStrategy } from './constants';
import { User } from './entities/user.entity';

@Injectable()
export class WsAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const client: Socket = context.switchToWs().getClient();
    const user: User = context.switchToHttp().getRequest().user;

    if (!client.rooms.has(user.id)) client.join(user.id);

    return Boolean(user);
  }
}