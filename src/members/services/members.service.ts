import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { Member } from '../entities/member.entity';
import { MemberRepository } from '../repositories/member.repository';

@Injectable()
export class MembersService {
  constructor(
    @Inject(MemberRepository.name)
    private readonly membersRepository: MemberRepository
  ) { }

  public async findById(id: string): Promise<Member> {
    return this.membersRepository.findById(id);
  }

  public async findByChat(chat: string): Promise<Member[]> {
    return this.membersRepository.findByChat(chat);
  }

  public async findByUser(user: string): Promise<Member[]> {
    return this.membersRepository.findByUser(user);
  }

  public async findByChatAndUser(chat: string, user: string): Promise<Member> {
    return this.membersRepository.findByChatAndUser(chat, user);
  }

  public async findByChatAndUsers(chat: string, users: string[]): Promise<Member[]> {
    return this.membersRepository.findByChatAndUsers(chat, users);
  }

  public async createMembers(chat: string, members: CreateMemberDto[]): Promise<Member[]> {
    const exists = await this.findByChatAndUsers(chat, members.map(m => m.user));

    const users = exists.map(m => (m.user as User).id);

    members = members.filter(m => !users.includes(m.user)).map(m => ({ ...m, chat }));

    return this.membersRepository.createMany(members);
  }
}
