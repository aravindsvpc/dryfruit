export interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;
  mrp?: number;
  type?: string;
  images: string[];
  description: string;
  inStock?: boolean;
  stockQuantity?: number;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: { [key: string]: CacheEntry<any> } = {};

// Cache helper functions
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

const getCachedData = <T>(key: string): T | null => {
  const entry = cache[key];
  if (entry && isCacheValid(entry.timestamp)) {
    return entry.data;
  }
  delete cache[key]; // Remove expired cache
  return null;
};

const setCacheData = <T>(key: string, data: T): void => {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
};

const clearCache = (key?: string): void => {
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
};

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
      // image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
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
      // image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
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
      // image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',    description: 'Fresh walnuts packed with omega-3 fatty acids',
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
      // image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
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
      // image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
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
  const cacheKey = 'products_all';
  
  // Check cache first
  const cachedData = getCachedData<Product[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  setCacheData(cacheKey, data);
  return data;
}

export const getAllProducts = (): Promise<Product[]> => {
  return fetchProducts();
};
export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const res = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create product');
  clearCache('products_all'); // Clear cache when product is created
  return res.json();
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
  clearCache('products_all'); // Clear cache when product is deleted
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const products = await fetchProducts();
  return products.filter(p => p.category === category);
};

// Flatten products into a shape compatible with the UI components that previously
// consumed varieties. Each product becomes a single "flat" item.
export type FlatProduct = Product & { categoryName: string; productName: string; productId: string; price: number; image: string };

export const getFlatProductList = async (): Promise<FlatProduct[]> => {
  const products = await fetchProducts();
  const flatList: FlatProduct[] = products.map(p => ({
    ...p,
    categoryName: p.category,
    productName: p.name,
    productId: p.id,
    price: p.price ?? 0,
    image: (p as any).images?.[0] ?? ''
  }));
  return flatList;
};

// Deal/Combo Types and API
export interface Deal {
  _id?: string;
  title: string;
  description?: string;
  image: string;
  price?: number;
  mrp?: number;
  discountPercentage?: number;
  productIds: string[];
  link?: string;
  active?: boolean;
}

export const fetchDeals = async (): Promise<Deal[]> => {
  const cacheKey = 'deals_all';
  
  const cachedData = getCachedData<Deal[]>(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE_URL}/api/deals`);
  if (!response.ok) throw new Error('Failed to fetch deals');
  
  const data = await response.json();
  setCacheData(cacheKey, data);
  return data;
};

export const createDeal = async (deal: Partial<Deal>): Promise<Deal> => {
  const res = await fetch(`${API_BASE_URL}/api/deals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deal),
  });
  if (!res.ok) throw new Error('Failed to create deal');
  return res.json();
};

export const updateDeal = async (id: string, updates: Partial<Deal>): Promise<Deal> => {
  const res = await fetch(`${API_BASE_URL}/api/deals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update deal');
  return res.json();
};

export const deleteDeal = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/deals/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete deal');
};
// Shop By Category Types and API
export interface ShopCategory {
  _id?: string;
  id: string;
  name: string;
  link: string;
  image: string;
  gradient: string;
  order: number;
  active: boolean;
}

export const fetchShopCategories = async (): Promise<ShopCategory[]> => {
  const response = await fetch(`${API_BASE_URL}/api/shop-categories`);
  if (!response.ok) throw new Error('Failed to fetch shop categories');
  return response.json();
};

export const fetchAllShopCategories = async (): Promise<ShopCategory[]> => {
  const cacheKey = 'shop_categories_all';
  
  const cachedData = getCachedData<ShopCategory[]>(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE_URL}/api/shop-categories/all`);
  if (!response.ok) throw new Error('Failed to fetch shop categories');
  
  const data = await response.json();
  setCacheData(cacheKey, data);
  return data;
};

export const createShopCategory = async (category: Partial<ShopCategory>): Promise<ShopCategory> => {
  const res = await fetch(`${API_BASE_URL}/api/shop-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error('Failed to create shop category');
  return res.json();
};

export const updateShopCategory = async (id: string, updates: Partial<ShopCategory>): Promise<ShopCategory> => {
  const res = await fetch(`${API_BASE_URL}/api/shop-categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update shop category');
  return res.json();
};

export const deleteShopCategory = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/shop-categories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete shop category');
};