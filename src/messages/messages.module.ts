import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './controllers/messages.controller';
import { MessageRepository } from './repositories/message.repository';
import { MessageMongoRepository } from './repositories/message.mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModel } from './models/message.model';
import { AuthModule } from '../auth/auth.module';
import { MessagesService } from './services/messages.service';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [MongooseModule.forFeature([MessageModel]), AuthModule, ChatsModule],
  providers: [{ provide: MessageRepository.name, useClass: MessageMongoRepository }, MessagesGateway, MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService]
})
export class MessagesModule { }
