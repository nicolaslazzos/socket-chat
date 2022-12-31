import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MemberStatus } from '../../members/entities/member.entity';
import { MembersService } from '../../members/services/members.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';
import { Message, MessageStatus } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MessageRepository.name)
    private readonly messagesRepository: MessageRepository,
    private readonly membersService: MembersService
  ) { }

  public async create(user: string, dto: CreateMessageDto): Promise<Message> {
    const member = await this.membersService.findByChatAndUser(dto.chat, user);

    if (member.status !== MemberStatus.ACTIVE) throw new ForbiddenException();

    return this.messagesRepository.create({ ...dto, member: member.id });
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
    return this.messagesRepository.updateById(id, { status: MessageStatus.DELETED });
  }
}
