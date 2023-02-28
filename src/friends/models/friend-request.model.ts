import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { FriendRequest as FriendRequestEntity, FriendRequestStatus } from '../entities/friend-request.entity';
import { User } from '../../auth/models/user.model';

@Schema({ timestamps: true })
export class FriendRequest extends Document {
  @Prop({ enum: FriendRequestStatus, default: FriendRequestStatus.CREATED })
  status: FriendRequestStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  sender: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  receiver: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  deletedBy: User;

  @Prop({ required: false })
  deletedAt: Date;

  public toEntity: () => FriendRequestEntity;
}

const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);

FriendRequestSchema.methods.toEntity = function (): FriendRequestEntity {
  let res = this.toJSON();

  const parse = (item: Types.ObjectId | Document & { toEntity: () => Object; }) => {
    if (item instanceof Types.ObjectId) {
      return item.toString();
    } else if (item instanceof Document) {
      return item.toEntity();
    } else {
      return item;
    }
  };

  for (const key of Object.keys(res)) {
    if (Array.isArray(res[key])) {
      res[key] = this[key].map(parse);
    } else {
      res[key] = parse(this[key]);
    }
  }

  res.id = this._id.toString();

  delete res._id;
  delete res.__v;

  return new FriendRequestEntity(res);
};

export const FriendRequestModel = { name: FriendRequest.name, schema: FriendRequestSchema };
