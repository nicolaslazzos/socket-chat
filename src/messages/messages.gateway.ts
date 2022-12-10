import { Inject, UseGuards, CACHE_MANAGER } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cache } from 'cache-manager';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageRepository } from './repositories/message.repository';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { WsAuthGuard } from 'src/auth/ws-auth.guard';
import { MembersService } from 'src/members/services/members.service';
import { RolesGuard } from 'src/members/role.guard';
import { Roles } from 'src/members/role.decorator';
import { MemberRole } from 'src/members/entities/member.entity';

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    @Inject(MessageRepository.name) private readonly messageRepository: MessageRepository,
    private readonly membersService: MembersService,
  ) { }

  @WebSocketServer()
  server: Server;

  @Roles(MemberRole.MEMBER)
  @UseGuards(WsAuthGuard, RolesGuard)
  @SubscribeMessage('new_message')
  async handleMessage(@GetUser() user: User, @MessageBody() dto: CreateMessageDto) {
    const message = await this.messageRepository.create({ ...dto, user: user.id });

    const members = await this.membersService.findByChat(message.chat);

    this.server.to(members.map((member) => (member.user as User).id)).emit('new_message_response', message);
  }

  @Roles(MemberRole.MEMBER)
  @UseGuards(WsAuthGuard, RolesGuard)
  @SubscribeMessage('get_messages')
  async handleGetMessages(@GetUser() user: User, @MessageBody('chat') chat: string) {
    const messages = await this.messageRepository.findByChat(chat);

    this.server.to(user.id).emit('get_messages_response', messages);
  }
}
