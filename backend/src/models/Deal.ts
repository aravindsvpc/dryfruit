import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description?: string;
  image: string;
  price?: number;
  mrp?: number;
  discountPercentage?: number;
  productIds: string[];
  link?: string;
  active?: boolean;
}

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  price: { type: Number },
  mrp: { type: Number },
  discountPercentage: { type: Number },
  productIds: { type: [String], required: true, default: [] },
  link: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Deal = mongoose.model<IDeal>('Deal', dealSchema);