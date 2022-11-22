import { CreateMemberDto } from '../dtos/create-member.dto';
import { Member } from '../entities/member.entity';

export abstract class MemberRepository {
  public abstract create(dto: CreateMemberDto): Promise<Member>;
  public abstract createMany(dto: CreateMemberDto[]): Promise<Member[]>;
  public abstract findByUser(user: string): Promise<Member[]>;
  public abstract findByChat(user: string): Promise<Member[]>;
}