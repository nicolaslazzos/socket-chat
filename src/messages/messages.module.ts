import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';

@Module({
  providers: [MessagesGateway],
  controllers: [MessagesController],
})
export class MessagesModule {}
