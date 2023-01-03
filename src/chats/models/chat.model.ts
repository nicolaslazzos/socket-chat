import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Chat as ChatEntity, ChatType } from '../entities/chat.entity';
import { User } from '../../auth/models/user.model';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ enum: ChatType, required: true })
  type: ChatType;

  @Prop({ required: false })
  name: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: User.name, required: true })
  users: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  owner: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  deletedBy: User;

  @Prop({ required: false })
  deletedAt: Date;

  public toEntity: () => ChatEntity;
}

const MessageSchema = SchemaFactory.createForClass(Chat);

MessageSchema.methods.toEntity = function (): ChatEntity {
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

  return new ChatEntity(res);
};

export const ChatModel = { name: Chat.name, schema: MessageSchema };
