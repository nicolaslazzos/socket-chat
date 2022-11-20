import { Injectable, Inject } from '@nestjs/common';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../entities/chat.entity';
import { ChatRepository } from '../repositories/chat.repository';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(ChatRepository.name)
    private readonly chatRepository: ChatRepository
  ) { }

  async create(dto: CreateChatDto): Promise<Chat> {
    return this.chatRepository.create(dto);
  }

  async findById(id: string): Promise<Chat> {
    return this.chatRepository.findById(id);
  }

  async findByUser(user: string): Promise<Chat[]> {
    return this.chatRepository.findByUser(user);
  }
}
