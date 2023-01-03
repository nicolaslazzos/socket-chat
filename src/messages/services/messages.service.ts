import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';
import { Message } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MessageRepository.name)
    private readonly messagesRepository: MessageRepository
  ) { }

  public async create(dto: CreateMessageDto): Promise<Message> {
    return this.messagesRepository.create(dto);
  }

  public async findById(id: string): Promise<Message> {
    const message = await this.messagesRepository.findById(id);

    if (!message) throw new NotFoundException();

    return message;
  }

  public async findByChat(chat: string): Promise<Message[]> {
    return this.messagesRepository.findByChat(chat);
  }

  public async updateById(id: string, dto: UpdateMessageDto): Promise<Message> {
    const message = await this.messagesRepository.updateById(id, dto);

    if (!message) throw new NotFoundException();

    return message;
  }

  public async deleteById(id: string): Promise<Message> {
    return this.messagesRepository.updateById(id, { deletedAt: new Date() });
  }
}
