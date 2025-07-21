import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductVariety } from '../data/products';

interface ProductVarietyCardProps {
  variety: ProductVariety & { categoryName: string; productName: string; productId: string; };
}


const ProductVarietyCard: React.FC<ProductVarietyCardProps> = ({ variety }) => {
  const { state, dispatch } = useCart();
  const [grams, setGrams] = React.useState(() => {
    // If a cart item exists for this product, use its grams, else default to 250
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
    const found = cart.items?.find((item: any) => item.id === variety.id && (variety.type === 'weight' ? !!item.grams : true));
    return found && found.grams ? found.grams : 250;
  });

  // Find if this item (with selected grams for weight) is in the cart
  const cartItem = state.items.find(
    item =>
      item.id === variety.id &&
      (variety.type === 'weight' ? item.grams === grams : true)
  );

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: variety.id,
        type: variety.type,
        name: variety.name,
        price: variety.price, // always base price (for 250g or 1 count)
        image: variety.image,
        grams: variety.type === 'weight' ? grams : undefined
      }
    });
  };

  const handleIncrease = () => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        id: variety.id,
        quantity: (cartItem?.quantity || 1) + 1,
        grams: variety.type === 'weight' ? grams : undefined
      }
    });
  };

  const handleDecrease = () => {
    if (cartItem && cartItem.quantity > 1) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: variety.id,
          quantity: cartItem.quantity - 1,
          grams: variety.type === 'weight' ? grams : undefined
        }
      });
    } else if (cartItem) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: variety.type === 'weight' ? { id: variety.id, grams } : variety.id
      });
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={variety.image}
          alt={variety.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-amber-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
          {variety.type === 'weight' ? (
            <>
              ₹{(variety.price * (grams / 250)).toFixed(2)}
              <span className="ml-1 text-xs text-white">/{grams}g</span>
            </>
          ) : (
            <>₹{variety.price}</>
          )}
        </div>
        {!variety.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs text-amber-600 font-medium uppercase tracking-wide">
            {variety.productName}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
          {variety.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {variety.description}
        </p>

        <div className="flex flex-col gap-2">
          {variety.type === 'weight' && (
            <div className="mb-2 flex items-center">
              <label className="text-xs text-gray-500 mr-2">Grams:</label>
              <select
                value={grams}
                onChange={e => setGrams(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-xs"
              >
                {[250, 500, 750, 1000, 1250, 1500, 1750, 2000].map(g => (
                  <option key={g} value={g}>{g}g</option>
                ))}
              </select>
              <span className="ml-2 text-xs text-gray-500">₹{(variety.price * (grams / 250)).toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Link
              to={`/products/${variety.productId || ''}/varieties/${variety.id}`}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              View Details
            </Link>
            {cartItem ? (
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={handleDecrease}
                  className="px-2 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3">{cartItem.quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="px-2 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!variety.inStock}
                className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
        
        {variety.stockQuantity <= 10 && variety.inStock && (
          <div className="mt-2 text-xs text-orange-600">
            Only {variety.stockQuantity} left in stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVarietyCard;