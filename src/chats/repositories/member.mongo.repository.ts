import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MemberRepository } from './member.repository';
import { Member as MemberModel } from '../models/member.model';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberMongoRepository extends MemberRepository {
  constructor(
    @InjectModel(MemberModel.name)
    private readonly memberModel: Model<MemberModel>
  ) {
    super();
  }

  async create(dto: CreateMemberDto): Promise<Member> {
    const member = await this.memberModel.create(dto);

    return member.toEntity();
  }

  async createMany(dto: CreateMemberDto[]): Promise<Member[]> {
    const members = await this.memberModel.insertMany(dto);

    return members.map((member) => member.toEntity());
  }

  async findByUser(user: string): Promise<Member[]> {
    const members = await this.memberModel.find({ user }).populate('user', 'username').populate('chat');

    return members.map((member) => member.toEntity());
  }

  async findByChat(chat: string): Promise<Member[]> {
    const members = await this.memberModel.find({ chat }).populate('user', 'username').populate('chat');

    return members.map((member) => member.toEntity());
  }
}