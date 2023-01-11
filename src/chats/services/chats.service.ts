import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateChatDto } from '../dtos/create-chat.dto';
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

    dto = { ...dto, owner: dto.createdBy };

    if (dto.type === ChatType.DIRECT) {
      if (users.length !== 2) throw new BadRequestException();

      const exists = await this.chatRepository.findByTypeAndUsers(ChatType.DIRECT, users);

      if (exists?.length) throw new ConflictException();

      delete dto.createdBy;
      delete dto.owner;
    }

    const chat = await this.chatRepository.create(dto);

    await this.membersService.create(chat.id, dto.members);

    return this.findById(chat.id);
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
