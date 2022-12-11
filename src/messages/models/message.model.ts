import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Message as MessageEntity, MessageStatus } from '../entities/message.entity';
import { Chat } from '../../chats/models/chat.model';
import { Member } from 'src/members/models/member.model';

@Schema()
export class Message extends Document {
  @Prop({ enum: MessageStatus, default: MessageStatus.ACTIVE, required: true })
  status: MessageStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Chat.name, required: true })
  chat: Chat;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Member.name, required: true })
  member: Member;

  @Prop({ required: true })
  text: string;

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

  if (Types.ObjectId.isValid(res.member)) {
    res.member = this.member.toString();
  } else {
    res.member = this.member.toEntity();
  }

  delete res._id;
  delete res.__v;

  return new MessageEntity(res);
};

export const MessageModel = { name: Message.name, schema: MessageSchema };
