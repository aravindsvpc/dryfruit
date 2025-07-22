import { Product } from '../models/Product';
import { connectDB } from '../db2';

const sampleProduct = {
    id: 'kismis',
    name: 'Kismis (Raisins)',
    basePrice:100,
    rating:4.7,
    category: 'raisins',
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/11/SA/KH/IG/26477838/indian-natural-green-kismis-raisins-1000x1000.jpg',
    description: 'Premium quality raisins available in multiple varieties',
    varieties: [
      {
        id: 'kismis-golden',
        name: 'Golden Kismis',
        type: 'weight',
        price: 100,
        description: 'Sweet and chewy golden raisins, perfect for snacking and cooking',
        image: 'https://5.imimg.com/data5/SELLER/Default/2021/11/SA/KH/IG/26477838/indian-natural-green-kismis-raisins-1000x1000.jpg',
        inStock: true,
        stockQuantity: 50
      },
      {
        id: 'kismis-black',
        name: 'Black Kismis',
        type: 'weight',
        price: 120,
        description: 'Rich and flavorful black raisins with natural sweetness',
        image: 'https://mcprod.hyperone.com.eg/media/catalog/product/cache/1ca275941aea0ae98b372dcb44b7c67a/2/3/2394510000000.jpeg',
        inStock: true,
        stockQuantity: 45
      },
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
