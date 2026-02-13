import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocumentModel } from 'common';

@Schema({
  collection: 'user',
  timestamps: true,
})
export class User extends BaseDocumentModel {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
