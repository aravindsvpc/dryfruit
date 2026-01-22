import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Product } from './models/Product';
import { Deal } from './models/Deal';
import { ShopByCategory } from './models/ShopByCategory';

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173','https://srisakhambari.onrender.com','https://srisakhambari-frontend.onrender.com'],// or your frontend URL
  credentials: true,
}));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://aravindsvpc:4diKx2TrbJhqDtPE@srisakhambari.1gmpdho.mongodb.net/ssdb';

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
      const idParam = req.params.id;
      // Accept either MongoDB _id or string product `id` field
      const query = mongoose.Types.ObjectId.isValid(idParam)
        ? { $or: [{ _id: idParam }, { id: idParam }] }
        : { id: idParam };
      const product = await Product.findOne(query as any);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } catch (err) {
      console.error('Product fetch error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // --- Deals API Endpoints ---
  app.get('/api/deals', async (req, res) => {
    try {
      const deals = await Deal.find();
      res.json(deals);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching deals', error: err });
    }
  });

  app.post('/api/deals', async (req, res) => {
    try {
      const { title, description, image, price, discountPercentage, productIds, link, active } = req.body;
      if (!title || !image || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ message: 'Missing required deal fields (title, image, productIds)' });
      }
      const deal = new Deal({ title, description, image, price, discountPercentage, productIds, link, active: active ?? true });
      await deal.save();
      return res.status(201).json(deal);
    } catch (err) {
      console.error('Create deal error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/deals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await Deal.findByIdAndUpdate(id, { $set: updates }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Deal not found' });
      return res.json(updated);
    } catch (err) {
      console.error('Update deal error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/deals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Deal.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Deal not found' });
      return res.json({ message: 'Deal deleted' });
    } catch (err) {
      console.error('Delete deal error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Create a new product
  app.post('/api/products', async (req, res) => {
    try {
      const { id, name, category, price, type, images, description, inStock, stockQuantity } = req.body;
      // require price and at least one image
      if (!name || !category || price === undefined || !Array.isArray(images) || images.length === 0 || !description) {
        return res.status(400).json({ message: 'Missing required product fields (name, category, price, images, description)' });
      }
      const productId = id || String(name).toLowerCase().replace(/\s+/g, '-');
      // prevent duplicate id
      const existing = await Product.findOne({ id: productId });
      if (existing) return res.status(409).json({ message: 'Product with this id already exists' });
      const product = new Product({ id: productId, name, category, price, type, images, description, inStock: inStock ?? true, stockQuantity: stockQuantity ?? 0 });
      await product.save();
      return res.status(201).json(product);
    } catch (err) {
      console.error('Create product error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Update product by id or _id
  app.put('/api/products/:id', async (req, res) => {
    try {
      const idParam = req.params.id;
      const query = mongoose.Types.ObjectId.isValid(idParam) ? { $or: [{ _id: idParam }, { id: idParam }] } : { id: idParam };
      const updates = req.body;
      const updated = await Product.findOneAndUpdate(query as any, { $set: updates }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Product not found' });
      return res.json(updated);
    } catch (err) {
      console.error('Update product error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete product
  app.delete('/api/products/:id', async (req, res) => {
    try {
      const idParam = req.params.id;
      const query = mongoose.Types.ObjectId.isValid(idParam) ? { $or: [{ _id: idParam }, { id: idParam }] } : { id: idParam };
      const deleted = await Product.findOneAndDelete(query as any);
      if (!deleted) return res.status(404).json({ message: 'Product not found' });
      return res.json({ message: 'Product deleted' });
    } catch (err) {
      console.error('Delete product error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // --- Shop By Category API Endpoints ---
  app.get('/api/shop-categories', async (req, res) => {
    try {
      const categories = await ShopByCategory.find({ active: true }).sort({ order: 1 });
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching shop categories', error: err });
    }
  });

  app.get('/api/shop-categories/all', async (req, res) => {
    try {
      const categories = await ShopByCategory.find().sort({ order: 1 });
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching shop categories', error: err });
    }
  });

  app.post('/api/shop-categories', async (req, res) => {
    try {
      const { id, name, link, image, gradient, order, active } = req.body;
      if (!id || !name || !link || !image) {
        return res.status(400).json({ message: 'Missing required fields (id, name, link, image)' });
      }
      const existing = await ShopByCategory.findOne({ id });
      if (existing) return res.status(409).json({ message: 'Category with this id already exists' });
      const category = new ShopByCategory({ id, name, link, image, gradient: gradient || 'from-amber-400 to-amber-600', order: order || 0, active: active ?? true });
      await category.save();
      return res.status(201).json(category);
    } catch (err) {
      console.error('Create shop category error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/shop-categories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await ShopByCategory.findByIdAndUpdate(id, { $set: updates }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Category not found' });
      return res.json(updated);
    } catch (err) {
      console.error('Update shop category error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/shop-categories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ShopByCategory.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Category not found' });
      return res.json({ message: 'Category deleted' });
    } catch (err) {
      console.error('Delete shop category error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

}
// app.use('/api', contactRouter);

