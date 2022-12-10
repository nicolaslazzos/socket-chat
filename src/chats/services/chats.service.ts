import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { CreateMemberDto } from '../../members/dtos/create-member.dto';
import { Chat } from '../entities/chat.entity';
import { Member, MemberRole } from '../../members/entities/member.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { MembersService } from '../../members/services/members.service';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(ChatRepository.name)
    private readonly chatRepository: ChatRepository,
    private readonly membersService: MembersService
  ) { }

  async create(dto: CreateChatDto): Promise<Chat> {
    const chat = await this.chatRepository.create(dto);

    const users = Array.from(new Set([...dto.users, dto.creator]));

    const members: CreateMemberDto[] = users.map((user: string) => {
      const role = user === chat.creator ? MemberRole.ADMIN : MemberRole.MEMBER;

      return { role, chat: chat.id, user };
    });

    await this.membersService.createMembers(chat.id, members);

    return chat;
  }

  async findById(id: string): Promise<Chat> {
    return this.chatRepository.findById(id);
  }

  async findByUser(user: string): Promise<Chat[]> {
    const members = await this.membersService.findByUser(user);

    return this.chatRepository.findByIds(members.map(m => (m.chat as Chat).id));
  }
}
