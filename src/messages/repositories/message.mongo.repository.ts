import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message as MessageModel } from '../models/message.model';
import { Message, MessageStatus } from '../entities/message.entity';
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
    const message = await this.messageModel.findById(id).populate({ path: 'member', populate: { path: 'user', select: 'username' } }).populate({ path: 'chat' });

    if (!message) throw new NotFoundException();

    return message.toEntity();
  }

  async findByUser(user: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ user }).populate({ path: 'member', populate: { path: 'user', select: 'username' } }).populate({ path: 'chat' });

    return messages.map((message) => message.toEntity());
  }

  async findByChat(chat: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ chat }).populate({ path: 'member', populate: { path: 'user', select: 'username' } }).populate({ path: 'chat' });

    return messages.map((message) => message.toEntity());
  }

  async updateById(id: string, dto: UpdateMessageDto): Promise<Message> {
    const message = await this.messageModel.findByIdAndUpdate(id, dto, { new: true });

    if (!message) throw new NotFoundException();

    return message.toEntity();
  }
}
