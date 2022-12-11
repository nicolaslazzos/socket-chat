import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { CreateMemberDto } from '../../members/dtos/create-member.dto';
import { Chat, ChatStatus, ChatType } from '../entities/chat.entity';
import { MemberRole } from '../../members/entities/member.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { MembersService } from '../../members/services/members.service';
import { UpdateChatDto } from '../dtos/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(ChatRepository.name)
    private readonly chatRepository: ChatRepository,
    private readonly membersService: MembersService
  ) { }

  async create(dto: CreateChatDto): Promise<Chat> {
    if (!dto.members.some((member) => member.user === dto.creator)) {
      dto.members.push({ role: MemberRole.ADMIN, user: dto.creator });
    }

    if (dto.type === ChatType.PRIVATE && dto.members.length > 2) throw new BadRequestException();

    const chat = await this.chatRepository.create(dto);

    const members: CreateMemberDto[] = dto.members.map((member) => {
      const role = member.user === chat.creator ? MemberRole.ADMIN : member.role;

      return { ...member, role, chat: chat.id };
    });

    await this.membersService.create(chat.id, members);

    return chat;
  }

  async findById(id: string): Promise<Chat> {
    return this.chatRepository.findById(id);
  }

  async findByUser(user: string): Promise<Chat[]> {
    const members = await this.membersService.findByUser(user);

    return this.chatRepository.findByIds(members.map(m => (m.chat as Chat).id));
  }

  async updateById(id: string, dto: UpdateChatDto): Promise<Chat> {
    return this.chatRepository.updateById(id, dto);
  }

  async deleteById(id: string): Promise<Chat> {
    return this.updateById(id, { status: ChatStatus.DELETED });
  }
}
