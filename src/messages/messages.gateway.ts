import { Inject, UseGuards, CACHE_MANAGER } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cache } from 'cache-manager';
import { CreateMessageDto } from './dtos/create-message.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { MembersService } from '../members/services/members.service';
import { RolesGuard } from '../common/role.guard';
import { Roles } from '../common/role.decorator';
import { MemberRole } from '../members/entities/member.entity';
import { MessagesService } from './services/messages.service';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { Chat } from '../chats/entities/chat.entity';

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    // @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly messagesService: MessagesService,
    private readonly membersService: MembersService,
  ) { }

  @WebSocketServer()
  server: Server;

  private emitToUser(user: string | User, message: string, content: any): void {
    const id = typeof user === 'string' ? user : user.id;

    this.server.to(id).emit(message, content);
  }

  private async emitToChat(chat: string | Chat, message: string, content: any): Promise<void> {
    const id = typeof chat === 'string' ? chat : chat.id;

    const members = await this.membersService.findByChat(id);

    this.server.to(members.map((member) => (member.user as User).id)).emit(message, content);
  }

  @Roles(MemberRole.MEMBER)
  @UseGuards(WsAuthGuard, RolesGuard)
  @SubscribeMessage('new_message')
  async handleMessage(@GetUser() user: User, @MessageBody() dto: CreateMessageDto) {
    const message = await this.messagesService.create(user.id, dto);

    await this.emitToChat(message.chat, 'new_message_response', message);
  }

  @Roles(MemberRole.MEMBER)
  @UseGuards(WsAuthGuard, RolesGuard)
  @SubscribeMessage('get_message')
  async handleGetMessage(@GetUser() user: User, @MessageBody('message') id: string) {
    const message = await this.messagesService.findById(id);

    this.emitToUser(user, 'get_message_response', message);
  }

  @Roles(MemberRole.MEMBER)
  @UseGuards(WsAuthGuard, RolesGuard)
  @SubscribeMessage('get_messages')
  async handleGetMessages(@GetUser() user: User, @MessageBody('chat') chat: string) {
    const messages = await this.messagesService.findByChat(chat);

    this.emitToUser(user, 'get_messages_response', messages);
  }

  @Roles(MemberRole.OWNER)
  @UseGuards(WsAuthGuard, RolesGuard)
  @SubscribeMessage('update_message')
  async handleUpdateMessage(@MessageBody('message') id: string, @MessageBody('update') dto: UpdateMessageDto) {
    const message = await this.messagesService.updateById(id, dto);

    await this.emitToChat(message.chat, 'update_message_response', message);
  }

  @Roles(MemberRole.ADMIN)
  @UseGuards(WsAuthGuard, RolesGuard)
  @SubscribeMessage('delete_message')
  async handleDeleteMessage(@MessageBody('message') id: string) {
    const message = await this.messagesService.deleteById(id);

    await this.emitToChat(message.chat, 'delete_message_response', message);
  }
}
