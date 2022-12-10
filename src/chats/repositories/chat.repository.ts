import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../entities/chat.entity';

export abstract class ChatRepository {
  public abstract create(dto: CreateChatDto): Promise<Chat>;
  public abstract findById(id: string): Promise<Chat>;
  public abstract findByIds(ids: string[]): Promise<Chat[]>;
}
