import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from './services/auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token: string = client.handshake.headers.authorization;

    const user = await this.authService.validateUser(token);

    context.switchToHttp().getRequest().user = user;

    if (!client.rooms.has(user.id)) client.join(user.id);

    return Boolean(user);
  }
}