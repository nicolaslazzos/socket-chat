import { CreateMemberDto } from '../dtos/create-member.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { Member } from '../entities/member.entity';

export abstract class MemberRepository {
  public abstract create(dto: CreateMemberDto): Promise<Member>;
  public abstract createMany(dto: CreateMemberDto[]): Promise<Member[]>;
  public abstract findById(id: string): Promise<Member>;
  public abstract findByUser(user: string): Promise<Member[]>;
  public abstract findByChat(chat: string): Promise<Member[]>;
  public abstract findByChatAndUser(chat: string, user: string): Promise<Member>;
  public abstract findByChatAndUsers(chat: string, users: string[]): Promise<Member[]>;
  public abstract updateById(id: string, dto: UpdateMemberDto): Promise<Member>;
}