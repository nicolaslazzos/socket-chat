import { CreateChatDto } from '../dtos/create-chat.dto';
import { UpdateChatDto } from '../dtos/update-chat.dto';
import { Chat, ChatType } from '../entities/chat.entity';

export abstract class ChatRepository {
  public abstract create(dto: CreateChatDto): Promise<Chat>;
  public abstract findById(id: string): Promise<Chat>;
  public abstract findByUser(user: string): Promise<Chat[]>;
  public abstract findByTypeAndUsers(type: ChatType, users: string[]): Promise<Chat[]>;
  public abstract updateById(id: string, dto: UpdateChatDto): Promise<Chat>;
  public abstract addUsersById(id: string, users: string[]): Promise<Chat>;
}
