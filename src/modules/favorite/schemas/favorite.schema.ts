import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocumentModel } from 'common';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({
  collection: 'favorite',
  timestamps: true,
})
export class Favorite extends BaseDocumentModel {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Toy',
    required: true,
    index: true,
  })
  toyId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  personalNote?: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
FavoriteSchema.index({ userId: 1, toyId: 1 }, { unique: true });