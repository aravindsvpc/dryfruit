import mongoose, { Schema, Document } from 'mongoose';

// Local type for variety subdocuments (not exported as a separate mongoose model)
// Product schema (product-only; no separate varieties)
export interface IProduct extends Document {
  id: string;
  name: string;
  category: string;
  price?: number;
  mrp?: number;
  type?: string; // e.g. 'weight' | 'unit' | 'pack'
  images: string[];
  // rating removed
  description: string;
  inStock?: boolean;
  stockQuantity?: number;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number },
  mrp: { type: Number },
  type: { type: String },
  images: { type: [String], required: true },
  description: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
