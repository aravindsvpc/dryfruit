import mongoose, { Schema, Document } from 'mongoose';

export interface IShopByCategory extends Document {
  id: string;
  name: string;
  link: string;
  image: string;
  gradient: string;
  order: number;
  active: boolean;
}

const ShopByCategorySchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
  gradient: { type: String, default: 'from-amber-400 to-amber-600' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const ShopByCategory = mongoose.model<IShopByCategory>('ShopByCategory', ShopByCategorySchema);
