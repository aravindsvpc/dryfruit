import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Package, Users, ShoppingBag, TrendingUp, Gift, Grid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFlatProductList, createProduct, updateProduct, deleteProduct, fetchDeals, createDeal, updateDeal, deleteDeal, Deal, fetchShopCategories, fetchAllShopCategories, createShopCategory, updateShopCategory, deleteShopCategory, ShopCategory } from '../data/products';
import { getCdnImageUrl } from '../constants/imageUrls';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user, adminLogin, isLoading } = useAuth();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form, setForm] = useState({ id: '', name: '', category: '', price: 0, mrp: 0, type: '', images: [''], description: '', inStock: true, stockQuantity: 0 });

  const [showAddDeal, setShowAddDeal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [dealForm, setDealForm] = useState({ title: '', description: '', image: '', price: 0, mrp: 0, discountPercentage: 0, productIds: [] as string[], link: '', active: true });
  const [allDeals, setAllDeals] = useState<Deal[]>([]);

  const [showAddShopCategory, setShowAddShopCategory] = useState(false);
  const [editingShopCategory, setEditingShopCategory] = useState<ShopCategory | null>(null);
  const [shopCategoryForm, setShopCategoryForm] = useState({ id: '', name: '', link: '', image: '', gradient: 'from-amber-400 to-amber-600', order: 0, active: true });
  const [allShopCategories, setAllShopCategories] = useState<ShopCategory[]>([]);

  // Mock data
  const stats = {
    totalProducts: 156,
    totalOrders: 1234,
    totalCustomers: 567,
    totalRevenue: 45678.90
  };
    const [allProducts, setAllProducts] = React.useState<any[]>([]);
    React.useEffect(() => {
      getFlatProductList().then((products) => {
        // Ensure productId is present (fallback to id if needed)
        setAllProducts(
          products.map((product: any) => ({
            ...product,
            productId: product.productId ?? product.id ?? '',
            inStock: product.inStock === true ? true : false, // fallback to 0 if undefined
          }))
        );
      });
      // Fetch deals
      fetchDeals().then(setAllDeals).catch(err => console.error('Error fetching deals:', err));
      // Fetch shop categories
      fetchAllShopCategories().then(setAllShopCategories).catch(err => console.error('Error fetching shop categories:', err));
    }, []);
    // const featuredProducts = allProducts.slice(0, 4);

    const products = allProducts
      .filter(product => product.id) // Only include products with valid IDs
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price ?? 0,
        mrp: product.mrp ?? 0,
        inStock: !!product.inStock,
        stockQuantity: product.stockQuantity ?? 0,
        category: product.categoryName ?? product.category ?? '',
        status: product.status ?? 'Active',
        image: product.image ?? '',
      }));

    const orders = [
      { id: 1001, customer: 'John Doe', total: 67.98, items: 3, status: 'Shipped', date: '2024-01-15' },
      { id: 1002, customer: 'Jane Smith', total: 45.50, items: 2, status: 'Processing', date: '2024-01-14' },
      { id: 1003, customer: 'Mike Johnson', total: 89.99, items: 4, status: 'Delivered', date: '2024-01-13' },
      { id: 1004, customer: 'Sarah Wilson', total: 32.99, items: 1, status: 'Pending', date: '2024-01-12' }
    ];

  if (!user?.isAdmin) {
    const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      try {
        await adminLogin(adminEmail, adminPassword);
      } catch (error: any) {
        setLoginError(error.message || 'Invalid credentials');
      }
    };

    return (
      <div className="min-h-screen bg-amber-50 py-8 flex items-center justify-center">
        <div className="max-w-md w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@dryfruit.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="text-sm text-gray-600 text-center mt-4">
              Demo: admin@dryfruit.com / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleView = (product: any) => {
    navigate(`/product/${product.id}/detail`);
  };

const handleEdit = (product: any) => {
  // Find the full product record from allProducts (it may contain more fields like type/description)
  const full = allProducts.find(p => p.id === product.id) || product;
  setEditingProduct(full);
  setForm({
    id: full.id ?? '',
    name: full.name ?? '',
    category: full.category ?? full.categoryName ?? '',
    price: full.price ?? 0,
    mrp: full.mrp ?? 0,
    type: full.type ?? '',
    images: (full.images && full.images.length > 0) ? full.images : (full.image ? [full.image] : ['']),
    description: full.description ?? '',
    inStock: !!full.inStock,
    stockQuantity: full.stockQuantity ?? 0
  });
  // Open modal for editing
  setShowAddProduct(true);
};

const handleDelete = (product: any) => {
  if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
    // Implement delete logic here (API call, update state, etc.)
    deleteProduct(product.id).then(() => {
      setAllProducts(prev => prev.filter(p => p.id !== product.id));
      alert(`Deleted product: ${product.name}`);
    }).catch(() => alert('Delete failed'));
  }
};

const handleOpenAdd = () => {
  setEditingProduct(null);
  setForm({ id: '', name: '', category: '', price: 0, mrp: 0, type: '', images: [''], description: '', inStock: true, stockQuantity: 0 });
  setShowAddProduct(true);
};

const handleFormSubmit = async (e: any) => {
  e.preventDefault();
  try {
    if (editingProduct) {
      // Convert filenames to full CDN URLs and filter out empty entries
      const images = (form.images || [])
        .filter((s: string) => !!s)
        .map((img: string) => getCdnImageUrl(img));
      const payload = { ...form, images } as any;
      const updated = await updateProduct(editingProduct.id, payload);
      setAllProducts(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
      alert('Product updated');
    } else {
      // Convert filenames to full CDN URLs and filter out empty entries
      const images = (form.images || [])
        .filter((s: string) => !!s)
        .map((img: string) => getCdnImageUrl(img));
      const payload = { ...form, images } as any;
      if (!payload.images.length) throw new Error('At least one image URL is required');
      await createProduct(payload);
      // refresh list
      const flat = await getFlatProductList();
      setAllProducts(flat);
      alert('Product created');
    }
    setShowAddProduct(false);
  } catch (err) {
    console.error(err);
    alert('Operation failed');
  }
};

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage your dry fruits business</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'deals', label: 'Deals/Combos', icon: Gift },
                { id: 'shop-categories', label: 'Shop Categories', icon: Grid },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'customers', label: 'Customers', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Products</h2>
              <button
                onClick={handleOpenAdd}
                className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>

            {showAddProduct && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-3">
                  {editingProduct ? <Edit2 className="h-5 w-5 text-amber-600" /> : <Plus className="h-5 w-5 text-amber-600" />}
                  <span>{editingProduct ? `Edit Product${editingProduct?.name ? ` — ${editingProduct.name}` : ''}` : 'Add Product'}</span>
                </h2>
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic info */}
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Basic info</h3>
                  </div>

                  <div>
                    <label htmlFor="product-id" className="block text-xs text-gray-600 mb-1">ID (optional)</label>
                    <input id="product-id" placeholder="e.g. kismis" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} className="border p-2 w-full" />
                  </div>

                  <div>
                    <label htmlFor="product-name" className="block text-xs text-gray-600 mb-1">Name</label>
                    <input id="product-name" placeholder="Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border p-2 w-full" />
                  </div>

                  <div>
                    <label htmlFor="product-category" className="block text-xs text-gray-600 mb-1">Category</label>
                    <input id="product-category" placeholder="Category" required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="border p-2 w-full" />
                  </div>

                  {/* Pricing & Inventory */}
                  <div className="col-span-2 mt-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Pricing & Inventory</h3>
                  </div>

                  {/* basePrice removed */}

                  <div>
                    <label htmlFor="product-price" className="block text-xs text-gray-600 mb-1">Price (₹)</label>
                    <input id="product-price" type="number" placeholder="Price (optional)" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="border p-2 w-full" />
                  </div>

                  <div>
                    <label htmlFor="product-mrp" className="block text-xs text-gray-600 mb-1">MRP (₹)</label>
                    <input id="product-mrp" type="number" placeholder="MRP (optional)" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: Number(e.target.value) }))} className="border p-2 w-full" />
                  </div>

                  <div>
                    <label htmlFor="product-type" className="block text-xs text-gray-600 mb-1">Type</label>
                    <input id="product-type" placeholder="weight or unit" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="border p-2 w-full" />
                  </div>

                  <div>
                    <label htmlFor="product-stock" className="block text-xs text-gray-600 mb-1">Stock quantity</label>
                    <input id="product-stock" type="number" placeholder="Stock Quantity" value={form.stockQuantity} onChange={e => setForm(f => ({ ...f, stockQuantity: Number(e.target.value) }))} className="border p-2 w-full" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input id="product-instock" type="checkbox" checked={!!form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} className="h-4 w-4" />
                    <label htmlFor="product-instock" className="text-sm text-gray-700">In stock</label>
                  </div>

                  {/* Media & Description */}
                  <div className="col-span-2 mt-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Media & Description</h3>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Image URLs</label>
                    <p className="text-xs text-gray-500 mb-2">Enter just the filename (e.g., srisakhamabari.png). It will be auto-converted to: https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/filename</p>
                    <div className="space-y-2">
                      {form.images.map((img: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input
                            placeholder="Image filename (e.g., product.png)"
                            required={idx === 0}
                            value={img}
                            onChange={e => setForm(f => ({ ...f, images: f.images.map((v: string, i: number) => i === idx ? e.target.value : v) }))}
                            className="border p-2 flex-1 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx).length ? f.images.filter((_, i) => i !== idx) : [''] }))}
                            className="px-2 py-1 border rounded text-sm text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div>
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, images: [...f.images, ''] }))}
                          className="text-sm text-amber-600 hover:underline"
                        >
                          + Add another image
                        </button>
                      </div>
                    </div>
                  </div>

                
                  <div className="col-span-2">
                    <label htmlFor="product-description" className="block text-xs text-gray-600 mb-1">Description</label>
                    <textarea id="product-description" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="border p-2 w-full" />
                  </div>
                  <div className="col-span-2 flex space-x-2">
                    <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded">{editingProduct ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.mrp || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stockQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.inStock ? 'Yes' : 'No'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === 'Active' ? 'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" onClick={() => handleView(product)}>
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-amber-600 hover:text-amber-900" onClick={() => handleEdit(product)}>
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(product)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-amber-600 hover:text-amber-900">
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-center py-8">
                Customer management features would be implemented here.
              </p>
            </div>
          </div>
        )}

        {/* Deals/Combos Tab */}
        {activeTab === 'deals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Deals & Combos</h2>
              <button
                onClick={() => {
                  setEditingDeal(null);
                  setDealForm({ title: '', description: '', image: '', price: 0, mrp: 0, discountPercentage: 0, productIds: [], link: '', active: true });
                  setShowAddDeal(true);
                }}
                className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Deal</span>
              </button>
            </div>

            {showAddDeal && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-3">
                  {editingDeal ? <Edit2 className="h-5 w-5 text-amber-600" /> : <Plus className="h-5 w-5 text-amber-600" />}
                  <span>{editingDeal ? `Edit Deal — ${editingDeal.title}` : 'Create Deal'}</span>
                </h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (!dealForm.title || !dealForm.image || dealForm.productIds.length === 0) {
                      alert('Please fill title, image, and select at least one product');
                      return;
                    }
                    if (editingDeal && editingDeal._id) {
                      await updateDeal(editingDeal._id, dealForm);
                      setAllDeals(prev => prev.map(d => d._id === editingDeal._id ? { ...d, ...dealForm } : d));
                      alert('Deal updated');
                    } else {
                      const newDeal = await createDeal(dealForm);
                      setAllDeals(prev => [...prev, newDeal]);
                      alert('Deal created');
                    }
                    setShowAddDeal(false);
                  } catch (err) {
                    console.error(err);
                    alert('Operation failed');
                  }
                }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Title *</label>
                    <input
                      required
                      placeholder="e.g. Premium Dry Fruits Combo"
                      value={dealForm.title}
                      onChange={e => setDealForm(f => ({ ...f, title: e.target.value }))}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Image URL *</label>
                    <input
                      required
                      placeholder="Image URL"
                      value={dealForm.image}
                      onChange={e => setDealForm(f => ({ ...f, image: e.target.value }))}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Total price"
                      value={dealForm.price}
                      onChange={e => setDealForm(f => ({ ...f, price: Number(e.target.value) }))}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      placeholder="MRP"
                      value={dealForm.mrp}
                      onChange={e => setDealForm(f => ({ ...f, mrp: Number(e.target.value) }))}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      placeholder="Discount percentage"
                      value={dealForm.discountPercentage}
                      onChange={e => setDealForm(f => ({ ...f, discountPercentage: Number(e.target.value) }))}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Description</label>
                    <textarea
                      placeholder="Deal description"
                      value={dealForm.description}
                      onChange={e => setDealForm(f => ({ ...f, description: e.target.value }))}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Link (Optional)</label>
                    <input
                      placeholder="Link to redirect"
                      value={dealForm.link}
                      onChange={e => setDealForm(f => ({ ...f, link: e.target.value }))}
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={dealForm.active}
                      onChange={e => setDealForm(f => ({ ...f, active: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <label className="text-sm text-gray-700">Active</label>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="product-select" className="block text-xs text-gray-600 mb-2">Select Products *</label>
                    <div className="flex gap-2">
                      <select
                        id="product-select"
                        defaultValue=""
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          if (selectedId) {
                            if (!dealForm.productIds.includes(selectedId)) {
                              setDealForm(f => ({ ...f, productIds: [...f.productIds, selectedId] }));
                            }
                            // Reset select to default
                            e.target.value = "";
                          }
                        }}
                        className="border p-2 flex-1"
                      >
                        <option value="">-- Add Product --</option>
                        {allProducts && allProducts.length > 0 ? (
                          allProducts
                            .filter(p => p && p.id && !dealForm.productIds.includes(p.id))
                            .map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name} (₹{product.price || 0})
                              </option>
                            ))
                        ) : (
                          <option disabled>No products available</option>
                        )}
                      </select>
                    </div>
                    
                    {/* Selected Products List */}
                    {dealForm.productIds.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-600 font-semibold">Selected Products ({dealForm.productIds.length}):</p>
                        <div className="flex flex-wrap gap-2">
                          {dealForm.productIds.map(productId => {
                            const product = allProducts.find(p => p.id === productId);
                            return product ? (
                              <div key={productId} className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                                <span>{product.name}</span>
                                <button
                                  type="button"
                                  onClick={() => setDealForm(f => ({ ...f, productIds: f.productIds.filter(id => id !== productId) }))}
                                  className="ml-2 font-bold hover:text-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 flex space-x-2">
                    <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded">{editingDeal ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => setShowAddDeal(false)} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allDeals.map((deal) => (
                      <tr key={deal._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {deal.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {deal.productIds.length} item(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{deal.price || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{deal.mrp || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {deal.discountPercentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            deal.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {deal.active ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-amber-600 hover:text-amber-900"
                              onClick={() => {
                                setEditingDeal(deal);
                                setDealForm({
                                  title: deal.title,
                                  description: deal.description || '',
                                  image: deal.image,
                                  price: deal.price || 0,
                                  mrp: deal.mrp || 0,
                                  discountPercentage: deal.discountPercentage || 0,
                                  productIds: deal.productIds,
                                  link: deal.link || '',
                                  active: deal.active ?? true
                                });
                                setShowAddDeal(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                if (window.confirm(`Delete deal: ${deal.title}?`)) {
                                  if (deal._id) {
                                    deleteDeal(deal._id).then(() => {
                                      setAllDeals(prev => prev.filter(d => d._id !== deal._id));
                                      alert('Deal deleted');
                                    }).catch(() => alert('Delete failed'));
                                  }
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Shop Categories Tab */}
        {activeTab === 'shop-categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Shop Categories</h3>
              <button
                onClick={() => {
                  setEditingShopCategory(null);
                  setShopCategoryForm({ id: '', name: '', link: '', image: '', gradient: 'from-amber-400 to-amber-600', order: 0, active: true });
                  setShowAddShopCategory(true);
                }}
                className="bg-amber-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-amber-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            </div>

            {showAddShopCategory && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold mb-4">{editingShopCategory ? 'Edit Category' : 'Add New Category'}</h4>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editingShopCategory && editingShopCategory._id) {
                      const updated = await updateShopCategory(editingShopCategory._id, shopCategoryForm);
                      setAllShopCategories(prev => prev.map(c => c._id === updated._id ? updated : c));
                      alert('Category updated');
                    } else {
                      const created = await createShopCategory(shopCategoryForm);
                      setAllShopCategories(prev => [...prev, created]);
                      alert('Category created');
                    }
                    setShowAddShopCategory(false);
                  } catch (err) {
                    console.error(err);
                    alert('Operation failed');
                  }
                }} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category ID</label>
                    <input
                      type="text"
                      value={shopCategoryForm.id}
                      onChange={(e) => setShopCategoryForm(f => ({ ...f, id: e.target.value }))}
                      placeholder="e.g., almonds"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      disabled={!!editingShopCategory}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={shopCategoryForm.name}
                      onChange={(e) => setShopCategoryForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g., Almonds"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                    <input
                      type="text"
                      value={shopCategoryForm.link}
                      onChange={(e) => setShopCategoryForm(f => ({ ...f, link: e.target.value }))}
                      placeholder="e.g., /products/Almonds"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      type="number"
                      value={shopCategoryForm.order}
                      onChange={(e) => setShopCategoryForm(f => ({ ...f, order: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="text"
                      value={shopCategoryForm.image}
                      onChange={(e) => setShopCategoryForm(f => ({ ...f, image: e.target.value }))}
                      placeholder="Image URL"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tailwind Gradient Classes</label>
                    <input
                      type="text"
                      value={shopCategoryForm.gradient}
                      onChange={(e) => setShopCategoryForm(f => ({ ...f, gradient: e.target.value }))}
                      placeholder="e.g., from-amber-400 to-amber-600"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shopCategoryForm.active}
                        onChange={(e) => setShopCategoryForm(f => ({ ...f, active: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                  <div className="col-span-2 flex space-x-2">
                    <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded">{editingShopCategory ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => setShowAddShopCategory(false)} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allShopCategories.map((category) => (
                      <tr key={category._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.link}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {category.active ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-amber-600 hover:text-amber-900"
                              onClick={() => {
                                setEditingShopCategory(category);
                                setShopCategoryForm({
                                  id: category.id,
                                  name: category.name,
                                  link: category.link,
                                  image: category.image,
                                  gradient: category.gradient,
                                  order: category.order,
                                  active: category.active
                                });
                                setShowAddShopCategory(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                if (window.confirm(`Delete category: ${category.name}?`)) {
                                  if (category._id) {
                                    deleteShopCategory(category._id).then(() => {
                                      setAllShopCategories(prev => prev.filter(c => c._id !== category._id));
                                      alert('Category deleted');
                                    }).catch(() => alert('Delete failed'));
                                  }
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;