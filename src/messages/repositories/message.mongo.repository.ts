import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message as MessageModel } from '../models/message.model';
import { Message } from '../entities/message.entity';
import { MessageRepository } from './message.repository';

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

  async findByUser(user: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ user }).populate('user', 'username');

    return messages.map((message) => message.toEntity());
  }
}
