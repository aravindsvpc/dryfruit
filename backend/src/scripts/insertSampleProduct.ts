import { Product } from '../models/Product';
import { connectDB } from '../db2';
import { Deal } from '../models/Deal';

const sampleProduct = {
    id: 'kismis',
    name: 'Kismis (Raisins)',
    price: 120,
    type: 'weight',
    category: 'raisins',
    images: ['https://5.imimg.com/data5/SELLER/Default/2021/11/SA/KH/IG/26477838/indian-natural-green-kismis-raisins-1000x1000.jpg'],
    description: 'Premium quality raisins available in multiple varieties',
    inStock: true,
    stockQuantity: 150
};
const sampleDeal = {
  image: 'https://www.instagram.com/reel/DPHU8MHElFs/?utm_source=ig_web_copy_link&igsh=MWY5NXQ4emk5eWFlOQ==',
  link: 'https://example.com/deal',
  title: 'Special Deal on Kismis',
  price: 90,
};

const insertSampleProduct = async () => {
  await connectDB();
  const product = new Product(sampleProduct);
  await product.save();
  console.log('Sample product inserted!');

  // const deal = new Deal(sampleDeal);
  // await deal.save();
  // console.log('Sample deal inserted!');
  process.exit(0);
};

insertSampleProduct();
