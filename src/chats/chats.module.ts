import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModel } from './models/chat.model';
import { ChatsController } from './controllers/chats.controller';
import { ChatRepository } from './repositories/chat.repository';
import { ChatMongoRepository } from './repositories/chat.mongo.repository';
import { ChatsService } from './services/chats.service';

@Module({
  providers: [{ provide: ChatRepository.name, useClass: ChatMongoRepository }, ChatsService],
  imports: [MongooseModule.forFeature([ChatModel])],
  controllers: [ChatsController],
  exports: [{ provide: ChatRepository.name, useClass: ChatMongoRepository }]
})
export class ChatsModule { }
