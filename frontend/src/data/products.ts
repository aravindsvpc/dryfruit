export interface ProductVariety {
  id: string;
  name: string;
  price: number;
  description: string;
  type: string;
  image: string;
  inStock: boolean;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
  rating: number;
  description: string;
  varieties: ProductVariety[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// export const products: Product[] = [
//   {
//     id: 'kismis',
//     name: 'Kismis (Raisins)',
//     category: 'raisins',
//     basePrice: 180,
//     image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//     rating: 4.6,
//     description: 'Premium quality raisins available in multiple varieties',
//     varieties: [
//       {
//         id: 'kismis-golden',
//         name: 'Golden Kismis',
//         price: 220,
//         description: 'Sweet and chewy golden raisins, perfect for snacking and cooking',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 50
//       },
//       {
//         id: 'kismis-black',
//         name: 'Black Kismis',
//         price: 180,
//         description: 'Rich and flavorful black raisins with natural sweetness',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 45
//       },
//       {
//         id: 'kismis-green',
//         name: 'Green Kismis',
//         price: 250,
//         description: 'Premium green raisins with unique tangy-sweet flavor',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 30
//       },
//       {
//         id: 'kismis-sultana',
//         name: 'Sultana Kismis',
//         price: 280,
//         description: 'Premium sultana raisins, seedless and naturally sweet',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 25
//       },
//       {
//         id: 'kismis-munakka',
//         name: 'Munakka',
//         price: 320,
//         description: 'Large, juicy munakka raisins with seeds, excellent for health',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 20
//       }
//     ]
//   },
//   {
//     id: 'kaju',
//     name: 'Kaju (Cashews)',
//     category: 'cashews',
//     basePrice: 800,
//     image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//     rating: 4.9,
//     description: 'Premium quality cashews in different grades and preparations',
//     varieties: [
//       {
//         id: 'kaju-w320',
//         name: 'Kaju W320',
//         price: 850,
//         description: 'Premium grade W320 cashews, large size and excellent quality',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 40
//       },
//       {
//         id: 'kaju-w240',
//         name: 'Kaju W240',
//         price: 950,
//         description: 'Extra large W240 cashews, premium quality for gifting',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 35
//       },
//       {
//         id: 'kaju-roasted',
//         name: 'Roasted Kaju',
//         price: 900,
//         description: 'Perfectly roasted cashews with light salt, ready to eat',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 30
//       }
//     ]
//   },
//   {
//     id: 'badam',
//     name: 'Badam (Almonds)',
//     category: 'almonds',
//     basePrice: 650,
//     image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//     rating: 4.8,
//     description: 'Premium quality almonds rich in protein and healthy fats',
//     varieties: [
//       {
//         id: 'badam-california',
//         name: 'California Badam',
//         price: 750,
//         description: 'Premium California almonds, large size and superior quality',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 60
//       },
//       {
//         id: 'badam-mamra',
//         name: 'Mamra Badam',
//         price: 1200,
//         description: 'Premium Mamra almonds from Iran, rich in oil and nutrients',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 25
//       },
//       {
//         id: 'badam-gurbandi',
//         name: 'Gurbandi Badam',
//         price: 900,
//         description: 'Small but nutrient-rich Gurbandi almonds from Afghanistan',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 40
//       }
//     ]
//   },
//   {
//     id: 'akhrot',
//     name: 'Akhrot (Walnuts)',
//     category: 'walnuts',
//     basePrice: 850,
//     image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//     rating: 4.7,    description: 'Fresh walnuts packed with omega-3 fatty acids',
//     varieties: [
//       {
//         id: 'akhrot-kashmir',
//         name: 'Kashmir Akhrot',
//         price: 950,
//         description: 'Premium Kashmir walnuts, fresh and naturally grown',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 35
//       },
//       {
//         id: 'akhrot-chilean',
//         name: 'Chilean Akhrot',
//         price: 800,
//         description: 'High-quality Chilean walnuts, light colored and crispy',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 45
//       }
//     ]
//   },
//   {
//     id: 'pista',
//     name: 'Pista (Pistachios)',
//     category: 'pistachios',
//     basePrice: 1200,
//     image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//     rating: 4.8,
//     description: 'Premium pistachios with satisfying crunch and rich flavor',
//     varieties: [
//       {
//         id: 'pista-iranian',
//         name: 'Iranian Pista',
//         price: 1400,
//         description: 'Premium Iranian pistachios, naturally opened and flavorful',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 30
//       },
//       {
//         id: 'pista-california',
//         name: 'California Pista',
//         price: 1200,
//         description: 'Large California pistachios, roasted and lightly salted',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 25
//       }
//     ]
//   },
//   {
//     id: 'khajur',
//     name: 'Khajur (Dates)',
//     category: 'dates',
//     basePrice: 350,
//     image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//     rating: 4.9,
//     description: 'Premium dates, naturally sweet and nutritious',
//     varieties: [
//       {
//         id: 'khajur-medjool',
//         name: 'Medjool Khajur',
//         price: 650,
//         description: 'Premium Medjool dates, large and incredibly sweet',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 40
//       },
//       {
//         id: 'khajur-ajwa',
//         name: 'Ajwa Khajur',
//         price: 800,
//         description: 'Premium Ajwa dates from Medina, soft and naturally sweet',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 30
//       },
//       {
//         id: 'khajur-kimia',
//         name: 'Kimia Khajur',
//         price: 450,
//         description: 'Iranian Kimia dates, soft texture and rich flavor',
//         image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
//         inStock: true,
//         stockQuantity: 50
//       }
//     ]
//   }
// ];

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  console.log(response);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
}

export const getAllProducts = (): Promise<Product[]> => {
  return fetchProducts();
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const products = await fetchProducts();
  return products.find(p => p.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const products = await fetchProducts();
  return products.filter(p => p.category === category);
};

export const getVarietyById = async (productId: string, varietyId: string): Promise<ProductVariety | undefined> => {
  const product = await getProductById(productId);
  return product?.varieties.find(v => v.id === varietyId);
};

export const getFlatProductList = async () => {
  const products = await fetchProducts();
  const flatList: Array<ProductVariety & { categoryName: string; productName: string; productId: string}> = [];
  
  products.forEach(product => {
    product.varieties.forEach(variety => {
      flatList.push({
        ...variety,
        categoryName: product.category,
        productName: product.name,
        productId: product.id,
      });
    });
  });
  
  return flatList;
};