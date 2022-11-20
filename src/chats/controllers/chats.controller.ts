import { Controller, Inject, Post, Body, Get, Param } from '@nestjs/common';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../entities/chat.entity';
import { ChatsService } from '../services/chats.service';

@Controller('chats')
export class ChatsController {
  constructor(
    @Inject(ChatsService) private readonly chatsService: ChatsService
  ) { }

  @Post()
  createChat(@Body() body: CreateChatDto): Promise<Chat> {
    return this.chatsService.create(body);
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<Chat> {
    return this.chatsService.findById(id);
  }

  @Get('/user/:id')
  getByUser(@Param('id') user: string): Promise<Chat[]> {
    return this.chatsService.findByUser(user);
  }
}
