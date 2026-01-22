import { connectDB } from '../db2';
import { ShopByCategory } from '../models/ShopByCategory';

const initializeShopCategories = async () => {
  await connectDB();
  try {
    // Check if categories already exist
    const existing = await ShopByCategory.countDocuments();
    if (existing > 0) {
      console.log('Shop categories already initialized');
      process.exit(0);
    }

    // Default shop categories
    const defaultCategories = [
      {
        id: 'deals',
        name: 'Combo Offers',
        link: '/deals',
        image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
        gradient: 'from-amber-400 to-amber-600',
        order: 0,
        active: true
      },
      {
        id: 'almonds',
        name: 'Almonds',
        link: '/products/Almonds',
        image: 'https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/Almonds.jpg',
        gradient: 'from-yellow-300 to-yellow-500',
        order: 1,
        active: true
      },
      {
        id: 'kaju',
        name: 'Cashews',
        link: '/products/Kaju',
        image: 'https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/Kaju.jpg',
        gradient: 'from-orange-300 to-orange-500',
        order: 2,
        active: true
      },
      {
        id: 'walnuts',
        name: 'Walnuts',
        link: '/products/Walnuts',
        image: 'https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/Walnut.jpg',
        gradient: 'from-amber-700 to-amber-900',
        order: 3,
        active: true
      },
      {
        id: 'dates',
        name: 'Dates',
        link: '/products/Dates',
        image: 'https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/Dates.jpg',
        gradient: 'from-red-700 to-red-900',
        order: 4,
        active: true
      },
      {
        id: 'all-products',
        name: 'All Products',
        link: '/products',
        image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
        gradient: 'from-green-400 to-green-600',
        order: 5,
        active: true
      }
    ];

    // Insert default categories
    await ShopByCategory.insertMany(defaultCategories);
    console.log('Shop categories initialized successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize shop categories:', err);
    process.exit(1);
  }
};

initializeShopCategories();
