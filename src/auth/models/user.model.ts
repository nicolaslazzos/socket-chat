import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../entities/user.entity';

@Schema()
export class UserDefinition extends Document {
  @Prop()
  username: string;

  @Prop()
  password: string;

  public toEntity: () => User;
}

const UserSchema = SchemaFactory.createForClass(UserDefinition);

UserSchema.methods.toEntity = function (): User {
  const res = this.toJSON();
  res.id = this.id;
  delete res._id;
  delete res.__v;
  return res;
};

export const UserModel = { name: UserDefinition.name, schema: UserSchema };
