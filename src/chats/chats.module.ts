import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModel } from './models/chat.model';
import { ChatsController } from './controllers/chats.controller';
import { ChatRepository } from './repositories/chat.repository';
import { ChatMongoRepository } from './repositories/chat.mongo.repository';
import { MemberRepository } from './repositories/member.repository';
import { MemberMongoRepository } from './repositories/member.mongo.repository';
import { ChatsService } from './services/chats.service';
import { AuthModule } from '../auth/auth.module';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { MemberModel } from './models/member.model';

@Module({
  providers: [
    { provide: MemberRepository.name, useClass: MemberMongoRepository },
    { provide: ChatRepository.name, useClass: ChatMongoRepository },
    ChatsService,
    MembersService
  ],
  imports: [
    MongooseModule.forFeature([ChatModel, MemberModel]),
    AuthModule
  ],
  controllers: [
    ChatsController,
    MembersController
  ],
  exports: [
    ChatsService,
    MembersService
  ]
})
export class ChatsModule { }
