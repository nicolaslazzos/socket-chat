import { Inject, UseGuards, CACHE_MANAGER } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageRepository } from './repositories/message.repository';
import { ChatRepository } from '../chats/repositories/chat.repository';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { GetUser } from '../auth/get-user-decorator';
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

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(@GetUser() user: User, @MessageBody() dto: CreateMessageDto) {
    const message = await this.messageRepository.create({ ...dto, user: user.id });

    const chat = await this.chatRepository.findById(message.chat, false);

    this.server.to(chat.users as string[]).emit('response', message);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('get_messages')
  async handleGetMessages(@MessageBody('chat') chat: string, @ConnectedSocket() client: Socket) {
    const messages = await this.messageRepository.findByChat(chat);

    this.server.to(client.id).emit('messages', messages);
  }
}
