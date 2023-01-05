import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { Member, MemberRole } from '../entities/member.entity';
import { MemberRepository } from '../repositories/member.repository';
import { ChatRepository } from '../repositories/chat.repository';

@Injectable()
export class MembersService {
  constructor(
    @Inject(MemberRepository.name)
    private readonly membersRepository: MemberRepository,
    @Inject(ChatRepository.name)
    private readonly chatsRepository: ChatRepository,
  ) { }

  public async create(chatId: string, members: CreateMemberDto[]): Promise<Member[]> {
    const chat = await this.chatsRepository.findById(chatId);

    if (!chat) throw new NotFoundException();

    const users = (chat.users as User[]).map(user => user.id);

    members = members.filter(m => !users.includes(m.user)).map(m => {
      return { ...m, role: m.role ?? MemberRole.MEMBER, chat: chat.id };
    });

    await this.chatsRepository.addUsersById(chat.id, members.map(m => m.user));

    return this.membersRepository.createMany(members);
  }

  public async findById(id: string): Promise<Member> {
    const member = await this.membersRepository.findById(id);

    if (!member) throw new NotFoundException();

    return member;
  }

  public async findByChat(chat: string): Promise<Member[]> {
    return this.membersRepository.findByChat(chat);
  }

  public async findByUser(user: string): Promise<Member[]> {
    return this.membersRepository.findByUser(user);
  }

  public async findByChatAndUser(chat: string, user: string): Promise<Member> {
    const member = await this.membersRepository.findByChatAndUser(chat, user);

    if (!member) throw new NotFoundException();

    return member;
  }

  public async findByChatAndUsers(chat: string, users: string[]): Promise<Member[]> {
    return this.membersRepository.findByChatAndUsers(chat, users);
  }

  public async updateById(id: string, dto: UpdateMemberDto): Promise<Member> {
    const member = await this.membersRepository.updateById(id, dto);

    if (!member) throw new NotFoundException();

    return member;
  }

  public async deleteById(id: string, dto: UpdateMemberDto = {}): Promise<Member> {
    return this.updateById(id, { ...dto, deletedAt: new Date() });
  }
}
