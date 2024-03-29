import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRepository } from './chat.repository';
import { Chat as ChatModel } from '../models/chat.model';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat, ChatType } from '../entities/chat.entity';
import { UpdateChatDto } from '../dtos/update-chat.dto';

@Injectable()
export class ChatMongoRepository extends ChatRepository {
  constructor(
    @InjectModel(ChatModel.name)
    private readonly chatModel: Model<ChatModel>
  ) {
    super();
  }

  async create(dto: CreateChatDto): Promise<Chat> {
    const chat = await this.chatModel.create(dto);

    return chat.toEntity();
  }

  async findById(id: string): Promise<Chat> {
    const chat = await this.chatModel.findOne({ _id: id, deletedAt: { $exists: false } }).populate('users owner createdBy', '-password');

    return chat ? chat.toEntity() : null;
  }

  async findByUser(user: string): Promise<Chat[]> {
    const chats = await this.chatModel.find({ users: user, deletedAt: { $exists: false } }).populate('users owner createdBy', '-password');

    return chats.map((chat) => chat.toEntity());
  }

  async findByTypeAndUsers(type: ChatType, users: string[]): Promise<Chat[]> {
    const chats = await this.chatModel.find({ type, users: { $all: users }, deletedAt: { $exists: false } }).populate('users owner createdBy', '-password');

    return chats.map((chat) => chat.toEntity());
  }

  async updateById(id: string, dto: UpdateChatDto): Promise<Chat> {
    const chat = await this.chatModel.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, dto, { new: true });

    return chat ? chat.toEntity() : null;
  }

  async addUsersById(id: string, users: string[]): Promise<Chat> {
    const chat = await this.chatModel.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, { $push: { users: { $each: users } } }, { new: true });

    return chat ? chat.toEntity() : null;
  }

  async removeUsersById(id: string, users: string[]): Promise<Chat> {
    const chat = await this.chatModel.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, { $pullAll: { users } }, { new: true });

    return chat ? chat.toEntity() : null;
  }
}
