import { Inject, Injectable } from '@nestjs/common';
import { Message } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MessageRepository.name)
    private readonly messagesRepository: MessageRepository
  ) { }

  public async findById(id: string): Promise<Message> {
    return this.messagesRepository.findById(id);
  }
}
