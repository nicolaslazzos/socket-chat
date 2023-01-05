import { Controller, Post, Get, Patch, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/get-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { MemberRole } from '../../chats/entities/member.entity';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';
import { Message } from '../entities/message.entity';
import { MessagesRolesGuard } from '../messages-roles.guard';
import { MessagesService } from '../services/messages.service';

@Controller('messages')
@UseGuards(AuthGuard())
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  @Roles(MemberRole.MEMBER)
  @UseGuards(MessagesRolesGuard)
  createMessage(@GetUser() user: User, @Body() dto: CreateMessageDto): Promise<Message> {
    return this.messagesService.create({ ...dto, user: user.id });
  }

  @Get()
  @Roles(MemberRole.MEMBER)
  @UseGuards(MessagesRolesGuard)
  getMessages(@Query('chat') chat: string): Promise<Message[]> {
    return this.messagesService.findByChat(chat);
  }

  @Get('/:message')
  @Roles(MemberRole.MEMBER)
  @UseGuards(MessagesRolesGuard)
  getMessage(@Param('message') message: string): Promise<Message> {
    return this.messagesService.findById(message);
  }

  @Patch('/:message')
  @Roles(MemberRole.OWNER)
  @UseGuards(MessagesRolesGuard)
  updateMessage(@Param('message') message: string, @Body() dto: UpdateMessageDto): Promise<Message> {
    return this.messagesService.updateById(message, dto);
  }

  @Delete('/:message')
  @Roles(MemberRole.ADMIN)
  @UseGuards(MessagesRolesGuard)
  deleteMessage(@Param('message') message: string, @GetUser() user: User): Promise<Message> {
    return this.messagesService.deleteById(message, { deletedBy: user.id });
  }
}
