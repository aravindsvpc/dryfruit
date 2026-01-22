import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FlatProduct } from '../data/products';

interface ProductVarietyCardProps {
  variety: FlatProduct;
}


const ProductVarietyCard: React.FC<ProductVarietyCardProps> = ({ variety }) => {
  const { state, dispatch } = useCart();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [grams, setGrams] = React.useState(() => {
    // If a cart item exists for this product, use its grams, else default to 250
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
    const productType = variety.type ?? 'unit';
    const found = cart.items?.find((item: any) => item.id === variety.id && (productType === 'weight' ? !!item.grams : true));
    return found && found.grams ? found.grams : 250;
  });

  // Find if this item (with selected grams for weight) is in the cart
  const productType = variety.type ?? 'unit';
  const cartItem = state.items.find(
    item =>
      item.id === variety.id &&
      (productType === 'weight' ? item.grams === grams : true)
  );

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: variety.id,
        type: productType as string,
        name: variety.name,
        price: variety.price, // always base price (for 250g or 1 count)
        image: variety.image,
        grams: productType === 'weight' ? grams : undefined
      }
    });
  };

  const handleIncrease = () => {
    dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: variety.id,
          quantity: (cartItem?.quantity || 1) + 1,
          grams: productType === 'weight' ? grams : undefined
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
          grams: productType === 'weight' ? grams : undefined
        }
      });
    } else if (cartItem) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: productType === 'weight' ? { id: variety.id, grams } : variety.id
      });
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <div className="w-full h-56 bg-gray-100 overflow-hidden">
          <img
            src={variety.image}
            alt={variety.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {!imageLoaded && (
            <div className="w-full h-56 bg-gray-200 flex items-center justify-center absolute inset-0">
              <div className="text-gray-400">Loading...</div>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <div className="bg-amber-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {variety.type === 'weight' ? (
              <>
                ₹{(variety.price * (grams / 250)).toFixed(2)}
                <span className="ml-1 text-xs text-white">/{grams}g</span>
              </>
            ) : (
              <>₹{variety.price}
              <span className="ml-1 text-xs text-white"></span></>
              
            )}
          </div>
          {variety.mrp && (
            <div className="bg-red-600 text-white px-2 py-0.5 rounded text-xs line-through">
              ₹{variety.type === 'weight' ? ((variety.mrp ?? 0) * (grams / 250)).toFixed(2) : variety.mrp}
            </div>
          )}
        </div>
        {!variety.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
          {variety.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {variety.description}
        </p>

        <div className="flex flex-col gap-2">
          {variety.type === 'weight' ? (
            <div className="mb-2 flex items-center">
              <label className="text-s text-gray-500 mr-2">Grams:</label>
              <select
                value={grams}
                onChange={e => setGrams(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-xs"
              >
                {[250, 500, 750, 1000, 1250, 1500, 1750, 2000].map(g => (
                  <option key={g} value={g}>{g}g</option>
                ))}
              </select>
              <span className="ml-2 text-s text-gray-500">₹{(variety.price * (grams / 250)).toFixed(2)}</span>
            </div>
          ) : (
            // Reserve same space so cards align when product has no weight options
            <div className="mb-2 h-7" aria-hidden="true">
            <span className="text-s text-gray-500 mr-2">{variety.type}</span>
            <span className="ml-2 text-s text-gray-500">- ₹{(variety.price)}</span>
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              
              {cartItem ? (
                <div className="flex items-center gap-2 justify-between w-full">
                  <div className="flex items-center border border-amber-600 rounded-lg justify-center h-10">
                    <button
                      onClick={handleDecrease}
                      className="px-2.5 py-2.5 hover:bg-amber-50 text-amber-600 font-bold text-xs"
                    >
                      −
                    </button>
                    <span className="px-3 py-2.5 border-x border-amber-600 font-semibold text-amber-1000 text-xs">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="px-2.5 py-2.5 hover:bg-amber-50 text-amber-600 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                  <Link
                    to="/cart"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors text-center font-semibold text-xs whitespace-nowrap flex items-center justify-center h-10"
                  >
                    View Cart
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!variety.inStock}
                  className="bg-amber-600 text-white font-semibold px-4 py-0 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md h-10"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
            <Link
              to={`/product/${variety.id}/detail`}
              className="w-full border-2 border-amber-600 text-amber-600 font-semibold py-2 rounded-lg hover:bg-amber-50 transition-all duration-200 flex items-center justify-center"
            >
              View Product
            </Link>
          </div>
        </div>
        
        {typeof variety.stockQuantity === "number" && variety.stockQuantity <= 10 && variety.inStock && (
          <div className="mt-2 text-xs text-orange-600">
            Only {variety.stockQuantity} left in stock
          </div>
        )}  
      </div>
    </div>
  );
};

export default memo(ProductVarietyCard);