import { Inject, CACHE_MANAGER } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway()
export class MessagesGateway {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ) {
    await this.cacheService.set(
      `client:${message.user}`,
      {
        socket: client.id,
      },
      { ttl: 0 },
    );

    const to = await this.cacheService.get<{ socket: string }>(
      `client:${message.to}`,
    );

    console.log(to);

    if (to?.socket) {
      this.server.sockets.to(to?.socket).emit('response', message);
    }
  }
}
