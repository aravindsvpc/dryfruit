import { Product } from '../models/Product';
import { connectDB } from '../db2';

const sampleProduct = {
  id: 'sample-id3',
  name: 'Sample Product3',
  category: 'sample-category3',
  basePrice: 100,
  image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
  rating: 4.5,
  description: 'This is a sample product3.',
  varieties: [
    {
      id: 'variety-3',
      name: 'Sample Variety3',
      type: 'weight',
      price: 30,
      description: 'Sample3 variety description.',
      image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
      inStock: true,
      stockQuantity: 10
    }
  ]
};

const insertSampleProduct = async () => {
  await connectDB();
  const product = new Product(sampleProduct);
  await product.save();
  console.log('Sample product inserted!');
  process.exit(0);
};

insertSampleProduct();
