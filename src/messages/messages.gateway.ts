import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const clients = {};

@WebSocketGateway()
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ) {
    clients[message.user] = client.id;

    if (clients[message.to]) {
      this.server.sockets.to(clients[message.to]).emit('response', message);
    }
  }
}
