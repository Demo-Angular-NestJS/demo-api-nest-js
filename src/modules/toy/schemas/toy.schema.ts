import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { BaseDocumentModel } from 'common';
import { Min, Max, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

@Schema({
  collection: 'toy',
  timestamps: true,
})
export class Toy extends BaseDocumentModel {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  productSKU: string;

  @Prop()
  shortDescription: string;

  @Prop()
  description: string;

  @Prop()
  tags: string[];

  @Prop()
  price: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  })
  categoryId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  imageUrls: string[];

  @Prop()
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(5)
  stars: number;

  @Prop()
  points: number;

  @Prop()
  inStock: number;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ToySchema = SchemaFactory.createForClass(Toy);
