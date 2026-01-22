
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

// Expecting route: /products/:productId
const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  // Support both new `/product/:id/detail` (param `id`) and legacy `/products/:productId`
  const params = useParams();
  const productId = (params as any).productId || (params as any).id;
  const { state, dispatch } = useCart();
  const [product, setProduct] = useState<any>(null);
  // Selected image for gallery
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [grams, setGrams] = useState(250);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Always use absolute URL for backend API in development
        const apiUrl = `${API_BASE_URL}/api/products/${productId}`;
        console.log('Fetching product from', apiUrl);
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
          // initialize selected image
          setSelectedImage((data.images && data.images.length > 0) ? data.images[0] : (data.image ?? ''));
        setLoading(false);
        // Speak product name when loaded
        if (data?.name && 'speechSynthesis' in window) {
          const utter = new window.SpeechSynthesisUtterance(data.name);
          window.speechSynthesis.speak(utter);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError((err as any).message || 'Error fetching product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Find if this item (with selected grams for weight) is in the cart
  const cartItem = state.items.find(
    item =>
      item.id === productId &&
      (product?.type === 'weight' ? item.grams === grams : true)
  );

  useEffect(() => {
    // If a cart item exists for this product, use its grams, else default to 250
    if (product?.type === 'weight') {
      const found = state.items.find(item => item.id === productId && item.grams);
      if (found && found.grams) setGrams(found.grams);
    }
    // ensure selectedImage is set when product changes
    if (product) {
      setSelectedImage((product.images && product.images.length > 0) ? product.images[0] : (product.image ?? ''));
    }
  }, [product, productId, state.items]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        type: product.type,
        name: product.name,
        price: product.price ?? 0,
        image: (product.images && product.images.length > 0) ? product.images[0] : product.image,
        grams: product.type === 'weight' ? grams : undefined
      }
    });
  };

  const handleIncrease = () => {
    if (!cartItem) return;
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        id: product.id,
        quantity: cartItem.quantity + 1,
        grams: product.type === 'weight' ? grams : undefined
      }
    });
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity > 1) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: product.id,
          quantity: cartItem.quantity - 1,
          grams: product.type === 'weight' ? grams : undefined
        }
      });
    } else {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: product.type === 'weight' ? { id: product.id, grams } : product.id
      });
    }
  };


  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !product) return <div className="p-8 text-center text-red-600">{error || 'Product not found'}</div>;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 font-semibold transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div>
              <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={selectedImage || ((product.images && product.images.length > 0) ? product.images[0] : product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnails (separate so they are not clipped) */}
              <div className="flex space-x-2 mt-3">
                {((product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : [])).map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded overflow-hidden border ${selectedImage === img ? 'ring-2 ring-amber-600' : 'ring-1 ring-gray-200'} focus:outline-none`}
                  >
                    <img src={img} alt={`${product.name}-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold text-amber-600">
                  ₹{product.type === 'weight' ? ((product.price ?? 0) * grams / 250).toFixed(2) : (product.price ?? 0)}
                  {product.type === 'weight' && <span className="ml-1 text-base text-gray-500">/{grams}g</span>}
                </p>
                {product.mrp && (
                  <p className="text-2xl text-gray-500 line-through">
                    ₹{product.type === 'weight' ? ((product.mrp ?? 0) * grams / 250).toFixed(2) : product.mrp}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 mb-6">{product.description}</p>
              <div className="space-y-4">
                {product.type === 'weight' && (
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Grams:</label>
                    <select
                      value={grams}
                      onChange={e => setGrams(Number(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {[250, 500, 750, 1000, 1250, 1500, 1750, 2000].map(g => (
                        <option key={g} value={g}>{g}g</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex space-x-4 items-center justify-between">
                    {cartItem ? (
                    <>
                      <div className="flex items-center border border-amber-600 rounded-lg">
                        <button
                          onClick={handleDecrease}
                          className="px-3 py-2 hover:bg-amber-50 text-amber-600 font-bold"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="px-4 py-2 border-x border-amber-600 font-semibold text-amber-600">{cartItem.quantity}</span>
                        <button
                          onClick={handleIncrease}
                          className="px-3 py-2 hover:bg-amber-50 text-amber-600 font-bold"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <Link
                        to="/cart"
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors text-center font-semibold text-sm"
                      >
                        View Cart
                      </Link>
                    </>
                    ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">    
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Quality guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Shipping charges extra</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;