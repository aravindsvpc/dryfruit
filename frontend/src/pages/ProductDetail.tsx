
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// Expecting route: /products/:productId/varieties/:varietyId
const ProductDetail: React.FC = () => {
  // Use correct param names for /products/:productId/varieties/:varietyId
  const { productId, varietyId } = useParams();
  const { state, dispatch } = useCart();
  const [variety, setVariety] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [grams, setGrams] = useState(250);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVariety = async () => {
      setLoading(true);
      try {
        // Always use absolute URL for backend API in development
        const apiUrl = `${API_BASE_URL}/api/products/${productId}/varieties/${varietyId}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Variety not found');
        const data = await res.json();
        setVariety(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching variety:', err);
        setError((err as any).message || 'Error fetching variety');
        setLoading(false);
      }
    };
    fetchVariety();
  }, [productId, varietyId]);

  // Find if this item (with selected grams for weight) is in the cart
  const cartItem = state.items.find(
    item =>
      item.id === varietyId &&
      (variety?.type === 'weight' ? item.grams === grams : true)
  );

  useEffect(() => {
    // If a cart item exists for this variety, use its grams, else default to 250
    if (variety?.type === 'weight') {
      const found = state.items.find(item => item.id === varietyId && item.grams);
      if (found && found.grams) setGrams(found.grams);
    }
  }, [variety, varietyId, state.items]);

  const handleAddToCart = () => {
    if (!variety) return;
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: variety.id,
        type: variety.type,
        name: variety.name,
        price: variety.price,
        image: variety.image,
        grams: variety.type === 'weight' ? grams : undefined
      }
    });
  };

  const handleIncrease = () => {
    if (!cartItem) return;
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        id: variety.id,
        quantity: cartItem.quantity + 1,
        grams: variety.type === 'weight' ? grams : undefined
      }
    });
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity > 1) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: variety.id,
          quantity: cartItem.quantity - 1,
          grams: variety.type === 'weight' ? grams : undefined
        }
      });
    } else {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: variety.type === 'weight' ? { id: variety.id, grams } : variety.id
      });
    }
  };


  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !variety) return <div className="p-8 text-center text-red-600">{error || 'Variety not found'}</div>;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{variety.productName || variety.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={variety.image}
                alt={variety.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{variety.name}</h1>
              <p className="text-3xl font-bold text-amber-600 mb-4">
                ₹{variety.type === 'weight' ? ((variety.price * grams) / 250).toFixed(2) : variety.price}
                {variety.type === 'weight' && <span className="ml-1 text-base text-gray-500">/{grams}g</span>}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 mb-6">{variety.description}</p>
              <div className="space-y-4">
                {variety.type === 'weight' && (
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
                <div className="flex space-x-4">
                  {cartItem ? (
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={handleDecrease}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3">{cartItem.quantity}</span>
                      <button
                        onClick={handleIncrease}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={!variety.inStock}
                      className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping on orders over ₹2000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Quality guarantee</span>
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