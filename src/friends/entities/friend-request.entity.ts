import { User } from "../../auth/entities/user.entity";

export enum FriendRequestStatus {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DELETED = 'deleted'
}

export enum FriendRequestType {
  SENT = 'sent',
  RECEIVED = 'received'
}

export class FriendRequest {
  id: string;
  status: FriendRequestStatus;
  sender: string | User;
  receiver: string | User;
  createdBy?: string | User;
  deletedBy?: string | User;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<FriendRequest>) {
    Object.assign(this, partial);
  }
}