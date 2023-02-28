import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Friend as FriendEntity } from '../entities/friend.entity';
import { User } from '../../auth/models/user.model';

@Schema({ timestamps: true })
export class Friend extends Document {
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: User.name, required: true })
  users: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  deletedBy: User;

  @Prop({ required: false })
  deletedAt: Date;

  public toEntity: () => FriendEntity;
}

const FriendSchema = SchemaFactory.createForClass(Friend);

FriendSchema.methods.toEntity = function (): FriendEntity {
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

  return new FriendEntity(res);
};

export const FriendModel = { name: Friend.name, schema: FriendSchema };
