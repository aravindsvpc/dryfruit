import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariety extends Document {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  stockQuantity: number;
}

const ProductVarietySchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  stockQuantity: { type: Number, required: true }
});

export interface IProduct extends Document {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
  rating: number;
  description: string;
  varieties: IProductVariety[];
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  basePrice: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  varieties: { type: [ProductVarietySchema], required: true }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
