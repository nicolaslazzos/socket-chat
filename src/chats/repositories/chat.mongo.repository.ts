import { Injectable } from '@nestjs/common';
import { Model, Query } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRepository } from './chat.repository';
import { Chat as ChatModel } from '../models/chat.model';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../entities/chat.entity';

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

  async findById(id: string, populate?: boolean): Promise<Chat> {
    let query: Query<ChatModel, ChatModel> = this.chatModel.findById(id);

    if (populate !== false) query = query.populate('users', 'username').populate('creator', 'username');

    const chat = await query;

    return chat.toEntity();
  }

  async findByUser(user: string): Promise<Chat[]> {
    const chats = await this.chatModel.find({ users: user }).populate('users', 'username').populate('creator', 'username');

    return chats.map((chat) => chat.toEntity());
  }
}
