import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { CreateMemberDto } from '../../members/dtos/create-member.dto';
import { Chat, ChatType } from '../entities/chat.entity';
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
    dto.users = Array.from(new Set([...dto.users, dto.createdBy]));

    const direct = dto.type === ChatType.DIRECT;

    if (direct) {
      if (dto.users.length > 2) throw new BadRequestException();

      const exists = await this.findDirectChats(dto.users);

      if (exists?.length) throw new ConflictException();

      delete dto.owner;
      delete dto.createdBy;
    } else {
      dto = { ...dto, owner: dto.createdBy };
    }

    const chat = await this.chatRepository.create(dto);

    const members: CreateMemberDto[] = dto.users.map((user) => {
      const role = user !== chat.createdBy || direct ? MemberRole.MEMBER : MemberRole.ADMIN;

      const member: CreateMemberDto = { role, user, chat: chat.id };

      if (!direct) member.createdBy = chat.createdBy as string;

      return member;
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
