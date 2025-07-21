import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header (Desktop only) */}
          <div className="px-4 py-3 border-b border-gray-200 hidden sm:block">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Total</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {state.items.map((item) => (
              <div key={item.id} className="px-4 py-4">
                {/* Mobile view */}
                <div className="flex flex-col sm:hidden space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                      {item.type === 'weight' && (
                        <div className="mt-1">
                          <label className="text-xs text-gray-500 mr-2">Grams:</label>
                          <select
                            value={item.grams || 250}
                            onChange={e => dispatch({ type: 'UPDATE_GRAMS', payload: { id: item.id, grams: parseInt(e.target.value) } })}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            {[250, 500, 750, 1000, 1250, 1500, 1750, 2000].map(g => (
                              <option key={g} value={g}>{g}g</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm flex items-center mt-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-700 px-1">
                    <div>
                      Price: <span className="font-medium text-gray-900">
                        ₹{item.type === 'weight'
                          ? (item.price * ((item.grams || 250) / 250)).toFixed(2)
                          : item.price.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      Total: <span className="font-bold text-amber-600">
                        ₹{item.type === 'weight'
                          ? (item.price * ((item.grams || 250) / 250) * item.quantity).toFixed(2)
                          : (item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop view */}
                <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                  <div className="col-span-6 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                      {item.type === 'weight' && (
                        <div className="mt-1">
                          <label className="text-xs text-gray-500 mr-2">Grams:</label>
                          <select
                            value={item.grams || 250}
                            onChange={e => dispatch({ type: 'UPDATE_GRAMS', payload: { id: item.id, grams: parseInt(e.target.value) } })}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            {[250, 500, 750, 1000, 1250, 1500, 1750, 2000].map(g => (
                              <option key={g} value={g}>{g}g</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center mt-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center text-base font-medium text-gray-900">
                    ₹{item.type === 'weight'
                      ? (item.price * ((item.grams || 250) / 250)).toFixed(2)
                      : item.price.toFixed(2)}
                  </div>

                  <div className="col-span-2 text-center text-base font-bold text-amber-600">
                    ₹{item.type === 'weight'
                      ? (item.price * ((item.grams || 250) / 250) * item.quantity).toFixed(2)
                      : (item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Link
              to="/products"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  ₹250
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{(state.total * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ₹{(state.total + 250 + state.total * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-amber-700 transition-colors mt-6 block text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;