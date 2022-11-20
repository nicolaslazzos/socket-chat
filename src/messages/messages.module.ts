import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { MessageRepository } from './repositories/message.repository';
import { MessageMongoRepository } from './repositories/message.mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModel } from './models/message.model';
import { ChatsModule } from '../chats/chats.module';

@Module({
  controllers: [MessagesController],
  providers: [{ provide: MessageRepository.name, useClass: MessageMongoRepository }, MessagesGateway],
  imports: [MongooseModule.forFeature([MessageModel]), ChatsModule]
})
export class MessagesModule { }
