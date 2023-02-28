import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FriendRequestsController } from './controllers/friend-requests.controller';
import { FriendsController } from './controllers/friends.controller';
import { FriendRequestModel } from './models/friend-request.model';
import { FriendModel } from './models/friend.model';
import { FriendRequestMongoRepository } from './repositories/friend-request.mongo.repository';
import { FriendRequestRepository } from './repositories/friend-request.repository';
import { FriendMongoRepository } from './repositories/friend.mongo.repository';
import { FriendRepository } from './repositories/friend.repository';
import { FriendRequestsService } from './services/friend-requests.service';
import { FriendsService } from './services/friends.service';

@Module({
  providers: [
    { provide: FriendRepository.name, useClass: FriendMongoRepository },
    { provide: FriendRequestRepository.name, useClass: FriendRequestMongoRepository },
    FriendsService,
    FriendRequestsService
  ],
  imports: [
    MongooseModule.forFeature([FriendModel, FriendRequestModel]),
    AuthModule
  ],
  controllers: [
    FriendsController,
    FriendRequestsController
  ]
})
export class FriendsModule { }
