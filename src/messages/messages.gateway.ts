import { Inject, UseGuards, CACHE_MANAGER } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cache } from 'cache-manager';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageRepository } from './repositories/message.repository';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/entities/user.entity';
import { ChatsService } from 'src/chats/services/chats.service';

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    @Inject(MessageRepository.name) private readonly messageRepository: MessageRepository,
    private readonly chatsService: ChatsService,
  ) { }

  @WebSocketServer()
  server: Server;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('new_message')
  async handleMessage(@GetUser() user: User, @MessageBody() dto: CreateMessageDto) {
    const message = await this.messageRepository.create({ ...dto, user: user.id });

    const members = await this.chatsService.findMembersByChat(message.chat);

    this.server.to(members.map((member) => (member.user as User).id)).emit('new_message_response', message);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('get_messages')
  async handleGetMessages(@GetUser() user: User, @MessageBody('chat') chat: string) {
    const messages = await this.messageRepository.findByChat(chat);

    this.server.to(user.id).emit('get_messages_response', messages);
  }
}
