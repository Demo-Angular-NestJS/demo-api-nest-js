import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocumentModel } from 'common';

@Schema({
  collection: 'category',
  timestamps: true,
})
export class Category extends BaseDocumentModel {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ required: true, lowercase: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0})
  minAge: number;

  @Prop({ default: 99})
  maxAge: number;

  @Prop({ type: [String], default: [] })
  educationalFocus: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Middleware to auto-generate slug if not provided
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});