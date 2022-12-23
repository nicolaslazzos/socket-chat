import { Controller, Post, Body, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/get-user.decorator';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../entities/chat.entity';
import { ChatsService } from '../services/chats.service';
import { Roles } from '../../common/role.decorator';
import { RolesGuard } from '../../common/role.guard';
import { MemberRole } from '../../members/entities/member.entity';
import { UpdateChatDto } from '../dtos/update-chat.dto';

@Controller('chats')
@UseGuards(AuthGuard())
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post()
  createChat(@Body() dto: CreateChatDto, @GetUser() user: User): Promise<Chat> {
    return this.chatsService.create({ ...dto, creator: user.id });
  }

  @Get()
  getChats(@GetUser() user: User): Promise<Chat[]> {
    return this.chatsService.findByUser(user.id);
  }

  @Get('/:chat')
  @Roles(MemberRole.MEMBER)
  @UseGuards(RolesGuard)
  getChat(@Param('chat') id: string): Promise<Chat> {
    return this.chatsService.findById(id);
  }

  @Patch('/:chat')
  @Roles(MemberRole.ADMIN)
  @UseGuards(RolesGuard)
  updateChat(@Param('chat') id: string, @Body() dto: UpdateChatDto): Promise<Chat> {
    return this.chatsService.updateById(id, dto);
  }

  @Delete('/:chat')
  @Roles(MemberRole.OWNER)
  @UseGuards(RolesGuard)
  deleteChat(@Param('chat') id: string): Promise<Chat> {
    return this.chatsService.deleteById(id);
  }
}
