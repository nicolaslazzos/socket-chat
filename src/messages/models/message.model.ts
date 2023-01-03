import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Message as MessageEntity } from '../entities/message.entity';
import { Chat } from '../../chats/models/chat.model';
import { User } from '../../auth/models/user.model';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Chat.name, required: true })
  chat: Chat;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ required: true })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  deletedBy: User;

  @Prop({ required: false })
  deletedAt: Date;

  public toEntity: () => MessageEntity;
}

const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.methods.toEntity = function (): MessageEntity {
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

  return new MessageEntity(res);
};

export const MessageModel = { name: Message.name, schema: MessageSchema };
