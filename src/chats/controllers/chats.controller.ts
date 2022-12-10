import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../entities/chat.entity';
import { ChatsService } from '../services/chats.service';
import { Roles } from '../../members/role.decorator';
import { RolesGuard } from '../../members/role.guard';
import { MemberRole } from '../../members/entities/member.entity';

@Controller('chats')
@UseGuards(AuthGuard())
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post()
  createChat(@Body() dto: CreateChatDto, @GetUser() user: User): Promise<Chat> {
    return this.chatsService.create({ ...dto, creator: user.id });
  }

  @Get()
  getByUser(@GetUser() user: User): Promise<Chat[]> {
    return this.chatsService.findByUser(user.id);
  }

  @Get('/:chat')
  @Roles(MemberRole.MEMBER)
  @UseGuards(RolesGuard)
  getById(@Param('chat') id: string): Promise<Chat> {
    return this.chatsService.findById(id);
  }
}
