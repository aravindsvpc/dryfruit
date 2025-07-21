import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Product } from './models/Product';

dotenv.config();
const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || '';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Example usage
if (require.main === module) {
  connectDB();
  app.use(cors({
  origin: 'http://localhost:5174' // or your frontend URL
}));

  app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    return res.json(products);
  });

}


