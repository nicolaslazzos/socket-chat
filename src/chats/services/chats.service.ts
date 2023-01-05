import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { Chat, ChatType } from '../entities/chat.entity';
import { MemberRole } from '../entities/member.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { MembersService } from './members.service';
import { UpdateChatDto } from '../dtos/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(ChatRepository.name)
    private readonly chatRepository: ChatRepository,
    private readonly membersService: MembersService
  ) { }

  async create(dto: CreateChatDto): Promise<Chat> {
    if (!dto.members.some(m => m.user === dto.createdBy)) {
      dto.members.push({ role: MemberRole.ADMIN, user: dto.createdBy });
    }

    const users = Array.from(new Set([...dto.members.map(m => m.user)]));

    if (dto.type === ChatType.DIRECT) {
      return this.createDirect({ type: dto.type, members: dto.members, users });
    }

    const chat = await this.chatRepository.create({ ...dto, owner: dto.createdBy });

    const members: CreateMemberDto[] = users.map((user) => {
      const m = dto.members.find(m => m.user === user);

      return { ...m, role: m.role ?? MemberRole.MEMBER, chat: chat.id, createdBy: dto.createdBy };
    });

    await this.membersService.create(chat.id, members);

    return this.findById(chat.id);
  }

  async createDirect(dto: CreateChatDto): Promise<Chat> {
    if (dto.users.length !== 2) throw new BadRequestException();

    const exists = await this.findDirectChats(dto.users);

    if (exists?.length) throw new ConflictException();

    const chat = await this.chatRepository.create(dto);

    const members: CreateMemberDto[] = dto.members.map((m) => {
      return { ...m, role: MemberRole.ADMIN, chat: chat.id };
    });

    await this.membersService.create(chat.id, members);

    return chat;
  }

  async findDirectChats(users: string[]): Promise<Chat[]> {
    return this.chatRepository.findByTypeAndUsers(ChatType.DIRECT, users);
  }

  async findById(id: string): Promise<Chat> {
    const chat = await this.chatRepository.findById(id);

    if (!chat) throw new NotFoundException();

    return chat;
  }

  async findByUser(user: string): Promise<Chat[]> {
    return this.chatRepository.findByUser(user);
  }

  async updateById(id: string, dto: UpdateChatDto): Promise<Chat> {
    const chat = await this.chatRepository.updateById(id, dto);

    if (!chat) throw new NotFoundException();

    return chat;
  }

  async deleteById(id: string, dto: UpdateChatDto = {}): Promise<Chat> {
    return this.updateById(id, { ...dto, deletedAt: new Date() });
  }
}
