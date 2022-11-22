import { Injectable, Inject } from '@nestjs/common';
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

    const members: CreateMemberDto[] = [];

    new Set([...dto.users, chat.creator as string]).forEach((user: string) => {
      const type = user === chat.creator ? MemberType.OWNER : MemberType.MEMBER;
      members.push({ type, chat: chat.id, user });
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
}
