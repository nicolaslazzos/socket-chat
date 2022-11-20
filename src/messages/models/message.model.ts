import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Message as MessageEntity } from '../entities/message.entity';
import { User } from '../../auth/models/user.model';
import { Chat } from '../../chats/models/chat.model';

@Schema()
export class Message extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Chat.name, required: true })
  chat: Chat;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  updated: Date;

  @Prop({ default: Date.now })
  created: Date;

  public toEntity: () => MessageEntity;
}

const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.methods.toEntity = function (): MessageEntity {
  const res = this.toJSON();

  res.id = this._id.toString();

  if (Types.ObjectId.isValid(res.chat)) {
    res.chat = this.chat.toString();
  } else {
    res.chat = this.chat.toEntity();
  }

  if (Types.ObjectId.isValid(res.user)) {
    res.user = this.user.toString();
  } else {
    res.user = this.user.toEntity();
  }

  delete res._id;
  delete res.__v;

  return new MessageEntity(res);
};

export const MessageModel = { name: Message.name, schema: MessageSchema };
