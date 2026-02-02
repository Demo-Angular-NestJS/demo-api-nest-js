import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'user',
  timestamps: true,
})
export class BaseDocumentModel extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: String })
  createdBy: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: String })
  updatedBy: string;

  @Prop()
  updatedAt: Date;
}
