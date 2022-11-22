import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Member as MemberEntity, MemberType } from '../entities/member.entity';
import { User } from '../../auth/models/user.model';
import { Chat } from './chat.model';

@Schema()
export class Member extends Document {
  @Prop({ enum: MemberType, required: true })
  type: MemberType;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Chat.name, required: true })
  chat: Chat;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ default: Date.now })
  updated: Date;

  @Prop({ default: Date.now })
  created: Date;

  public toEntity: () => MemberEntity;
}

const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.methods.toEntity = function (): MemberEntity {
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

  return new MemberEntity(res);
};

export const MemberModel = { name: Member.name, schema: MemberSchema };