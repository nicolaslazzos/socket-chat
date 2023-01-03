import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MemberRepository } from './member.repository';
import { Member as MemberModel } from '../../members/models/member.model';
import { CreateMemberDto } from '../../members/dtos/create-member.dto';
import { Member } from '../../members/entities/member.entity';
import { UpdateMemberDto } from '../dtos/update-member.dto';

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

  async findById(id: string): Promise<Member> {
    const member = await this.memberModel.findOne({ _id: id, deletedAt: { $exists: false } }).populate('user', '-password');

    return member ? member.toEntity() : null;
  }

  async findByUser(user: string): Promise<Member[]> {
    const members = await this.memberModel.find({ user, deletedAt: { $exists: false } }).populate('user', '-password');

    return members.map((member) => member.toEntity());
  }

  async findByChat(chat: string): Promise<Member[]> {
    const members = await this.memberModel.find({ chat, deletedAt: { $exists: false } }).populate('user', '-password');

    return members.map((member) => member.toEntity());
  }

  async findByChatAndUser(chat: string, user: string): Promise<Member> {
    const members = await this.findByChatAndUsers(chat, [user]);

    return members?.length ? members[0] : null;
  }

  async findByChatAndUsers(chat: string, users: string[]): Promise<Member[]> {
    const members = await this.memberModel.find({ chat, user: { $in: users }, deletedAt: { $exists: false } }).populate('user', '-password').populate('chat');

    return members.map((member) => member.toEntity());
  }

  async updateById(id: string, dto: UpdateMemberDto): Promise<Member> {
    const member = await this.memberModel.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, dto, { new: true });

    return member ? member.toEntity() : null;
  }
}