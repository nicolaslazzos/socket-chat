import { Controller, Post, Body, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/get-user.decorator';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../entities/chat.entity';
import { ChatsService } from '../services/chats.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { MemberRole } from '../../members/entities/member.entity';
import { UpdateChatDto } from '../dtos/update-chat.dto';
import { ChatsRolesGuard } from '../chats-roles.guard';

@Controller('chats')
@UseGuards(AuthGuard())
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post()
  createChat(@Body() dto: CreateChatDto, @GetUser() user: User): Promise<Chat> {
    return this.chatsService.create({ ...dto, createdBy: user.id });
  }

  @Get()
  getChats(@GetUser() user: User): Promise<Chat[]> {
    return this.chatsService.findByUser(user.id);
  }

  @Get('/:chat')
  @Roles(MemberRole.MEMBER)
  @UseGuards(ChatsRolesGuard)
  getChat(@Param('chat') id: string): Promise<Chat> {
    return this.chatsService.findById(id);
  }

  @Patch('/:chat')
  @Roles(MemberRole.ADMIN)
  @UseGuards(ChatsRolesGuard)
  updateChat(@Param('chat') id: string, @Body() dto: UpdateChatDto): Promise<Chat> {
    return this.chatsService.updateById(id, dto);
  }

  @Delete('/:chat')
  @Roles(MemberRole.OWNER)
  @UseGuards(ChatsRolesGuard)
  deleteChat(@Param('chat') id: string, @GetUser() user: User): Promise<Chat> {
    return this.chatsService.deleteById(id, { deletedBy: user.id });
  }
}
