import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModel } from './models/chat.model';
import { ChatsController } from './controllers/chats.controller';
import { ChatRepository } from './repositories/chat.repository';
import { ChatMongoRepository } from './repositories/chat.mongo.repository';
import { ChatsService } from './services/chats.service';
import { MemberRepository } from './repositories/member.repository';
import { MemberMongoRepository } from './repositories/member.mongo.repository';
import { MemberModel } from './models/member.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [{ provide: ChatRepository.name, useClass: ChatMongoRepository }, { provide: MemberRepository.name, useClass: MemberMongoRepository }, ChatsService],
  imports: [MongooseModule.forFeature([ChatModel, MemberModel]), AuthModule],
  controllers: [ChatsController],
  exports: [ChatsService]
})
export class ChatsModule { }
