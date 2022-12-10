import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersController } from './controllers/members.controller';
import { MembersService } from './services/members.service';
import { MemberModel } from '../members/models/member.model';
import { MemberRepository } from './repositories/member.repository';
import { MemberMongoRepository } from './repositories/member.mongo.repository';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  providers: [{ provide: MemberRepository.name, useClass: MemberMongoRepository }, MembersService],
  imports: [MongooseModule.forFeature([MemberModel]), AuthModule, forwardRef(() => MessagesModule)],
  controllers: [MembersController],
  exports: [MembersService]
})
export class MembersModule { }
