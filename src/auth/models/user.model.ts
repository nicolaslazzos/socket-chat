import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User as UserEntity } from '../entities/user.entity';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  public toEntity: () => UserEntity;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toEntity = function (): UserEntity {
  const res = this.toJSON();

  res.id = this.id;

  delete res._id;
  delete res.__v;

  return new UserEntity(res);
};

export const UserModel = { name: User.name, schema: UserSchema };
