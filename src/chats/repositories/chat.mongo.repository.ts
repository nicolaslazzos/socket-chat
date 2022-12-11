import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRepository } from './chat.repository';
import { Chat as ChatModel } from '../models/chat.model';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat, ChatStatus } from '../entities/chat.entity';
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
    const chat = await this.chatModel.findOne({ _id: id, status: { $ne: ChatStatus.DELETED } }).populate('creator', 'username');

    if (!chat) throw new NotFoundException();

    return chat.toEntity();
  }

  async findByIds(ids: string[]): Promise<Chat[]> {
    const chats = await this.chatModel.find({ _id: { $in: ids }, status: { $ne: ChatStatus.DELETED } }).populate('creator', 'username');

    return chats.map((chat) => chat.toEntity());
  }

  async updateById(id: string, dto: UpdateChatDto): Promise<Chat> {
    const chat = await this.chatModel.findOneAndUpdate({ _id: id, status: { $ne: ChatStatus.DELETED } }, dto, { new: true });

    if (!chat) throw new NotFoundException();

    return chat.toEntity();
  }
}
