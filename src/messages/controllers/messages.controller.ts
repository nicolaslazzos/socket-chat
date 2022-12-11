import { Controller, Post, Get, Patch, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/common/role.decorator';
import { RolesGuard } from 'src/common/role.guard';
import { MemberRole } from 'src/members/entities/member.entity';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';
import { Message, MessageStatus } from '../entities/message.entity';
import { MessagesService } from '../services/messages.service';

@Controller('messages')
@UseGuards(AuthGuard())
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  @Roles(MemberRole.MEMBER)
  @UseGuards(AuthGuard(), RolesGuard)
  createMessage(@GetUser() user: User, @Body() dto: CreateMessageDto): Promise<Message> {
    return this.messagesService.create(user.id, dto);
  }

  @Get()
  @Roles(MemberRole.MEMBER)
  @UseGuards(AuthGuard(), RolesGuard)
  getMessages(@Query('chat') chat: string): Promise<Message[]> {
    return this.messagesService.findByChat(chat);
  }

  @Get('/:message')
  @Roles(MemberRole.MEMBER)
  @UseGuards(AuthGuard(), RolesGuard)
  getMessage(@Param('message') message: string): Promise<Message> {
    return this.messagesService.findById(message);
  }

  @Patch('/:message')
  @Roles(MemberRole.OWNER)
  @UseGuards(AuthGuard(), RolesGuard)
  updateMessage(@Param('message') message: string, @Body() dto: UpdateMessageDto): Promise<Message> {
    return this.messagesService.updateById(message, dto);
  }

  @Delete('/:message')
  @Roles(MemberRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  deleteMessage(@Param('message') message: string): Promise<Message> {
    return this.messagesService.updateById(message, { status: MessageStatus.DELETED });
  }
}