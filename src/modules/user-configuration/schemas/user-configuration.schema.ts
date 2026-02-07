import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { BaseDocumentModel } from 'common';

@Schema({
  collection: 'userConfiguration',
  timestamps: true,
})
export class UserConfiguration extends BaseDocumentModel {
  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'user',
    required: true,
    unique: true,
  })
  userId: MongooseSchema.Types.ObjectId | string;
  
  @Prop({ default: true })
  enableEmailNotifications: boolean;

  @Prop({ default: true })
  enableOrderStatus: boolean;

  @Prop({ default: 'UTC' })
  systemTimeZone: string;
}

export const UserConfigurationSchema = SchemaFactory.createForClass(UserConfiguration);
