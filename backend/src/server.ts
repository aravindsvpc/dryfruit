import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Product } from './models/Product';


dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173','https://srisakhambari.onrender.com','https://srisakhambari-frontend.onrender.com'],// or your frontend URL
  credentials: true,
}));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Example usage
if (require.main === module) {
  connectDB();
  

  app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    return res.json(products);
  });
  app.get('/api/health', async (req, res) => {
    return res.json({ status: 'ok' });
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Get a single variety by productId and varietyId
  app.get('/api/products/:productId/varieties/:varietyId', async (req, res) => {
    try {
      const product = await Product.findOne({ $or: [{ id: req.params.productId }, { id: req.params.productId }] });
      if (!product) {
        console.error('Product not found for productId:', req.params.productId);
        return res.status(404).json({ message: 'Product not found' });
      }
      if (!Array.isArray(product.varieties)) {
        console.error('Product varieties not found or not an array:', product);
        return res.status(500).json({ message: 'Product varieties not found' });
      }
      // Log all variety ids for debugging
      console.log('Available variety ids:', product.varieties.map(v => v.id));
      const variety = product.varieties.find((v) => String(v.id) === String(req.params.varietyId));
      if (!variety) {
        console.error('Variety not found for varietyId:', req.params.varietyId, 'in product:', product._id || product.id);
        return res.status(404).json({ message: 'Variety not found' });
      }
      // Add productId to the returned variety for frontend routing
      return res.json({ ...variety.toObject(), productId: product.id?.toString?.() || product.id, productName: product.name, categoryName: product.category });
    } catch (err) {
      console.error('Variety fetch error:', err);
      return res.status(500).json({ message: 'Server error', error: (err as any)?.message || err });
    }
  });

}
// app.use('/api', contactRouter);

