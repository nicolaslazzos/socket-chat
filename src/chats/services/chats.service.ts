import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
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

  async findByIdAndCreator(id: string, creator: string): Promise<Chat> {
    return this.chatRepository.findByIdAndCreator(id, creator);
  }

  async findByUser(user: string): Promise<Chat[]> {
    return this.chatRepository.findByUser(user);
  }

  async findMembersByChat(chat: string): Promise<Member[]> {
    return this.memberRepository.findByChat(chat);
  }

  async canUserAddMembers(chat: string, user: string): Promise<void> {
    const members = await this.memberRepository.findByChatAndUsers(chat, [user]);

    const can = members.some(m => [MemberType.OWNER, MemberType.ADMIN].includes(m.type));

    if (!can) throw new UnauthorizedException();
  }

  async canUserSendMessages(chat: string, user: string): Promise<void> {
    const members = await this.memberRepository.findByChatAndUsers(chat, [user]);

    if (!members.length) throw new UnauthorizedException();
  }

  async canUserGetMessages(chat: string, user: string): Promise<void> {
    const members = await this.memberRepository.findByChatAndUsers(chat, [user]);

    if (!members.length) throw new UnauthorizedException();
  }

  async addMembers(id: string, user: string, members: CreateMemberDto[]): Promise<Member[]> {
    await this.canUserAddMembers(id, user);

    const exists = await this.memberRepository.findByChatAndUsers(id, members.map(m => m.user));

    const users = exists.map(m => (m.user as User).id);

    members = members.filter(m => !users.includes(m.user)).map(m => ({ ...m, chat: id }));

    return this.memberRepository.createMany(members);
  }
}
