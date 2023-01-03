import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Member as MemberEntity, MemberRole } from '../entities/member.entity';
import { User } from '../../auth/models/user.model';
import { Chat } from '../../chats/models/chat.model';

@Schema({ timestamps: true })
export class Member extends Document {
  @Prop({ enum: MemberRole, default: MemberRole.MEMBER, required: true })
  role: MemberRole;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Chat.name, required: true })
  chat: Chat;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ default: false, required: false })
  muted: Boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
  deletedBy: User;

  @Prop({ required: false })
  deletedAt: Date;

  public toEntity: () => MemberEntity;
}

const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.methods.toEntity = function (): MemberEntity {
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

  return new MemberEntity(res);
};

export const MemberModel = { name: Member.name, schema: MemberSchema };