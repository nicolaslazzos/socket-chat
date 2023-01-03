import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message as MessageModel } from '../models/message.model';
import { Message } from '../entities/message.entity';
import { MessageRepository } from './message.repository';
import { UpdateMessageDto } from '../dtos/update-message.dto';

@Injectable()
export class MessageMongoRepository extends MessageRepository {
  constructor(
    @InjectModel(MessageModel.name)
    private readonly messageModel: Model<MessageModel>
  ) {
    super();
  }

  async create(dto: CreateMessageDto): Promise<Message> {
    const message = await this.messageModel.create(dto);

    return message.toEntity();
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messageModel.findOne({ _id: id, deletedAt: { $exists: false } }).populate('user', '-password');

    return message ? message.toEntity() : null;
  }

  async findByUser(user: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ user, deletedAt: { $exists: false } }).populate('user', '-password');

    return messages.map((message) => message.toEntity());
  }

  async findByChat(chat: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ chat, deletedAt: { $exists: false } }).populate('user', '-password');

    return messages.map((message) => message.toEntity());
  }

  async updateById(id: string, dto: UpdateMessageDto): Promise<Message> {
    const message = await this.messageModel.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, dto, { new: true });

    return message ? message.toEntity() : null;
  }
}
