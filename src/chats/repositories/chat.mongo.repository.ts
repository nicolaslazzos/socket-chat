import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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

  async findById(id: string): Promise<Chat> {
    const chat = await this.chatModel.findById(id).populate('creator', 'username');

    return chat.toEntity();
  }

  async findByUser(user: string): Promise<Chat[]> {
    const chats = await this.chatModel.find({ users: user }).populate('creator', 'username');

    return chats.map((chat) => chat.toEntity());
  }
}
