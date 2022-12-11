import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MemberRepository } from './member.repository';
import { Member as MemberModel } from '../../members/models/member.model';
import { CreateMemberDto } from '../../members/dtos/create-member.dto';
import { Member, MemberStatus } from '../../members/entities/member.entity';
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
    const member = await this.memberModel.findOne({ _id: id, status: { $ne: MemberStatus.DELETED } }).populate('user', 'username').populate('chat');

    if (!member) throw new NotFoundException();

    return member.toEntity();
  }

  async findByUser(user: string): Promise<Member[]> {
    const members = await this.memberModel.find({ user, status: { $ne: MemberStatus.DELETED } }).populate('user', 'username').populate('chat');

    return members.map((member) => member.toEntity());
  }

  async findByChat(chat: string): Promise<Member[]> {
    const members = await this.memberModel.find({ chat, status: { $ne: MemberStatus.DELETED } }).populate('user', 'username').populate('chat');

    return members.map((member) => member.toEntity());
  }

  async findByChatAndUser(chat: string, user: string): Promise<Member> {
    const members = await this.findByChatAndUsers(chat, [user]);

    if (!members?.length) throw new NotFoundException();

    return members[0];
  }

  async findByChatAndUsers(chat: string, users: string[]): Promise<Member[]> {
    const members = await this.memberModel.find({ chat, user: users, status: { $ne: MemberStatus.DELETED } }).populate('user', 'username').populate('chat');

    return members.map((member) => member.toEntity());
  }

  async updateById(id: string, dto: UpdateMemberDto): Promise<Member> {
    const member = await this.memberModel.findOneAndUpdate({ _id: id, status: { $ne: MemberStatus.DELETED } }, dto, { new: true });

    if (!member) throw new NotFoundException();

    return member.toEntity();
  }
}