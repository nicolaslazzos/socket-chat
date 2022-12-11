import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';
import { Message } from '../entities/message.entity';

export abstract class MessageRepository {
  public abstract create(dto: CreateMessageDto): Promise<Message>;
  public abstract findById(id: string): Promise<Message>;
  public abstract findByUser(user: string): Promise<Message[]>;
  public abstract findByChat(chat: string): Promise<Message[]>;
  public abstract updateById(id: string, dto: UpdateMessageDto): Promise<Message>;
}
