import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { MessageRepository } from './repositories/message.repository';
import { MessageMongoRepository } from './repositories/message.mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModel } from './models/message.model';
import { ChatsModule } from '../chats/chats.module';
import { AuthModule } from '../auth/auth.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [MongooseModule.forFeature([MessageModel]), AuthModule, MembersModule],
  providers: [{ provide: MessageRepository.name, useClass: MessageMongoRepository }, MessagesGateway],
  controllers: [MessagesController],
})
export class MessagesModule { }
