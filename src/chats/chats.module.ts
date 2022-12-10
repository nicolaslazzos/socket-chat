import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModel } from './models/chat.model';
import { ChatsController } from './controllers/chats.controller';
import { ChatRepository } from './repositories/chat.repository';
import { ChatMongoRepository } from './repositories/chat.mongo.repository';
import { ChatsService } from './services/chats.service';
import { AuthModule } from '../auth/auth.module';
import { MembersModule } from '../members/members.module';

@Module({
  providers: [{ provide: ChatRepository.name, useClass: ChatMongoRepository }, ChatsService],
  imports: [MongooseModule.forFeature([ChatModel]), AuthModule, MembersModule],
  controllers: [ChatsController],
  exports: [ChatsService]
})
export class ChatsModule { }
