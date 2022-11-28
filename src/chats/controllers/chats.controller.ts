import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../entities/chat.entity';
import { ChatsService } from '../services/chats.service';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { Member } from '../entities/member.entity';

@Controller('chats')
@UseGuards(AuthGuard())
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post()
  createChat(@Body() dto: CreateChatDto, @GetUser() user: User): Promise<Chat> {
    return this.chatsService.create({ ...dto, creator: user.id });
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<Chat> {
    return this.chatsService.findById(id);
  }

  @Get('/user/:id')
  getByUser(@Param('id') user: string): Promise<Chat[]> {
    return this.chatsService.findByUser(user);
  }

  @Post('/:id/members')
  addMembers(@Param('id') chat: string, @Body() dto: CreateMemberDto[]): Promise<Member[]> {
    return this.chatsService.addMembers(chat, dto);
  }
}
