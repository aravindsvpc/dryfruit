import { connectDB } from '../db2';
import { Product } from '../models/Product';

const removeFields = async () => {
  await connectDB();
  try {
    const res = await Product.updateMany({}, { $unset: { basePrice: "", rating: "" } });
    console.log('Updated documents:', res.modifiedCount ?? res);
  } catch (err) {
    console.error('Failed to remove fields:', err);
  } finally {
    process.exit(0);
  }
};

removeFields();
