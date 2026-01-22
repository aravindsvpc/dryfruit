import { connectDB } from '../db2';
import mongoose from 'mongoose';
import { Product } from '../models/Product';

async function run() {
  await connectDB();
  try {
    const res = await Product.updateMany({ varieties: { $exists: true } }, { $unset: { varieties: "" } });
    console.log('Matched:', (res as any).matchedCount ?? (res as any).n ?? 0);
    console.log('Modified:', (res as any).modifiedCount ?? (res as any).nModified ?? 0);
  } catch (err) {
    console.error('Error updating products:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
