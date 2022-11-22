import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Chat as ChatEntity, ChatType } from '../entities/chat.entity';
import { User } from 'src/auth/models/user.model';

@Schema()
export class Chat extends Document {
  @Prop({ enum: ChatType, required: true })
  type: ChatType;

  @Prop({ required: false })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  creator: User;

  @Prop({ default: Date.now })
  updated: Date;

  @Prop({ default: Date.now })
  created: Date;

  public toEntity: () => ChatEntity;
}

const MessageSchema = SchemaFactory.createForClass(Chat);

MessageSchema.methods.toEntity = function (): ChatEntity {
  const res = this.toJSON();

  res.id = this._id.toString();

  if (Types.ObjectId.isValid(res.creator)) {
    res.creator = this.creator.toString();
  } else {
    res.creator = this.creator.toEntity();
  }

  delete res._id;
  delete res.__v;

  return new ChatEntity(res);
};

export const ChatModel = { name: Chat.name, schema: MessageSchema };
