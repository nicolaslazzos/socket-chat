import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { Member, MemberStatus } from '../entities/member.entity';
import { MemberRepository } from '../repositories/member.repository';

@Injectable()
export class MembersService {
  constructor(
    @Inject(MemberRepository.name)
    private readonly membersRepository: MemberRepository
  ) { }

  public async create(chat: string, members: CreateMemberDto[]): Promise<Member[]> {
    const exists = await this.findByChatAndUsers(chat, members.map(m => m.user));

    const users = exists.map(m => (m.user as User).id);

    members = members.filter(m => !users.includes(m.user)).map(m => ({ ...m, chat }));

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

  public async deleteById(id: string): Promise<Member> {
    return this.updateById(id, { status: MemberStatus.DELETED, deletedAt: new Date() });
  }
}
