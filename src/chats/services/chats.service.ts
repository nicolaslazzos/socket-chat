import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { Chat } from '../entities/chat.entity';
import { Member, MemberType } from '../entities/member.entity';
import { ChatRepository } from '../repositories/chat.repository';
import { MemberRepository } from '../repositories/member.repository';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(ChatRepository.name)
    private readonly chatRepository: ChatRepository,
    @Inject(MemberRepository.name)
    private readonly memberRepository: MemberRepository
  ) { }

  async create(dto: CreateChatDto): Promise<Chat> {
    const chat = await this.chatRepository.create(dto);

    const users = Array.from(new Set([...dto.users, dto.creator]));

    const members: CreateMemberDto[] = users.map((user: string) => {
      const type = user === chat.creator ? MemberType.OWNER : MemberType.MEMBER;
      return { type, chat: chat.id, user };
    });

    await this.memberRepository.createMany(members);

    return chat;
  }

  async findById(id: string): Promise<Chat> {
    return this.chatRepository.findById(id);
  }

  async findByUser(user: string): Promise<Chat[]> {
    return this.chatRepository.findByUser(user);
  }

  async findMembersByChat(chat: string): Promise<Member[]> {
    return this.memberRepository.findByChat(chat);
  }

  async addMembers(id: string, members: CreateMemberDto[]): Promise<Member[]> {
    const chat = await this.findById(id);

    const exists = await this.memberRepository.findByChatAndUsers(chat.id, members.map(m => m.user));

    const users = exists.map(m => (m.user as User).id);

    members = members.filter(m => !users.includes(m.user)).map(m => ({ ...m, chat: chat.id }));

    return this.memberRepository.createMany(members);
  }
}
