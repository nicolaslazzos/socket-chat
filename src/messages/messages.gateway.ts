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
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageRepository } from './repositories/message.repository';
import { ChatRepository } from '../chats/repositories/chat.repository';
import { User } from '../auth/entities/user.entity';

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    @Inject(MessageRepository.name) private readonly messageRepository: MessageRepository,
    @Inject(ChatRepository.name) private readonly chatRepository: ChatRepository
  ) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messageRepository.create(dto);

    await this.cacheService.set(
      `client:${message.user}`,
      { socket: client.id },
      { ttl: 0 },
    );

    const chat = await this.chatRepository.findById(message.chat as string);

    (chat.users as User[]).forEach(async (user: User) => {
      const to = await this.cacheService.get<{ socket: string; }>(
        `client:${user.id}`,
      );

      console.log(to);

      if (to?.socket) {
        this.server.sockets.to(to?.socket).emit('response', message);
      }
    });
  }
}
