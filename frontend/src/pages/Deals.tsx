import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, ArrowLeft } from 'lucide-react';
import { fetchDeals, fetchProducts } from '../data/products';
import { useCart } from '../context/CartContext';

const Deals: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [dealsWithProducts, setDealsWithProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([fetchDeals(), fetchProducts()])
      .then(([dealsData, productsData]) => {
        // Enrich deals with product info and filter active deals
        const enriched = dealsData
          .filter((deal: any) => deal.active !== false)
          .map((deal: any) => ({
            ...deal,
            products: deal.productIds
              .map((id: string) => productsData.find(p => p.id === id))
              .filter(Boolean)
          }));
        setDealsWithProducts(enriched);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (deal: any) => {
    // Add entire deal as a single product to cart
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: deal._id || deal.id,
        type: 'deal',
        name: deal.title,
        price: deal.price ?? 0,
        image: deal.image,
        isDeal: true,
        dealProducts: deal.productIds
      }
    });
  };

  const handleIncrease = (deal: any) => {
    const cartItem = state.items.find(item => item.id === (deal._id || deal.id));
    if (cartItem) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: deal._id || deal.id,
          quantity: cartItem.quantity + 1
        }
      });
    }
  };

  const handleDecrease = (deal: any) => {
    const cartItem = state.items.find(item => item.id === (deal._id || deal.id));
    if (cartItem && cartItem.quantity > 1) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: deal._id || deal.id,
          quantity: cartItem.quantity - 1
        }
      });
    } else if (cartItem) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: deal._id || deal.id
      });
    }
  };

  const getDealCartItem = (deal: any) => {
    return state.items.find(item => item.id === (deal._id || deal.id));
  };

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto px-4 py-12 text-center">
        <p>Loading deals...</p>
      </div>
    );
  }

  if (dealsWithProducts.length === 0) {
    return (
      <div className="max-w-8xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Deals & Combos</h1>
        <p className="text-gray-600">No deals available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 font-semibold transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Deals & Combos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dealsWithProducts.map((deal: any) => (
          <div key={deal._id || deal.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative w-full h-56 bg-gradient-to-br from-amber-100 to-amber-50 overflow-hidden">
              {deal.image ? (
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-200">
                  <ShoppingCart className="h-16 w-16" />
                </div>
              )}
              
              {/* Price Badge - Bottom Left */}
              {deal.price && (
                <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1">
                  <div className="bg-white rounded-lg shadow-lg px-3 py-2 font-bold text-amber-700 text-lg">
                    ₹{deal.price}
                  </div>
                  {deal.mrp && (
                    <div className="bg-red-100 rounded-lg shadow-lg px-2 py-1 font-bold text-red-700 text-sm line-through">
                      ₹{deal.mrp}
                    </div>
                  )}
                </div>
              )}
              
              {/* Discount Badge - Top Right */}
              {deal.discountPercentage > 0 && (
                <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-3 py-1 font-bold text-sm shadow-lg">
                  {deal.discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col" style={{ minHeight: '280px' }}>
              {/* Title */}
              <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                {deal.title}
              </h3>

              {/* Item Count */}
              <div className="mb-3">
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                  {deal.products?.length || 0} Items in Combo
                </span>
              </div>

              {/* Products List */}
              <div className="mb-4 flex-grow">
                <div className="space-y-1 text-xs">
                  {deal.products?.slice(0, 3).map((product: any) => (
                    <div key={product.id} className="text-gray-600 flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span className="line-clamp-1">{product.name}</span>
                    </div>
                  ))}
                  {deal.products?.length > 3 && (
                    <div className="text-gray-500 italic text-xs pl-4">
                      +{deal.products.length - 3} more...
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart / Quantity Control */}
              <div className="space-y-3">
                {getDealCartItem(deal) ? (
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center rounded-lg justify-center bg-amber-50">
                      <button
                        onClick={() => handleDecrease(deal)}
                        className="px-2 py-1.5 hover:bg-amber-100 text-amber-600 font-bold text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 font-semibold text-amber-1000 text-sm">
                        {getDealCartItem(deal)?.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(deal)}
                        className="px-2 py-1.5 hover:bg-amber-100 text-amber-600 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                    <Link
                      to="/cart"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors text-center font-semibold text-sm whitespace-nowrap"
                    >
                      View Cart
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(deal)}
                    className="w-full bg-amber-600 text-white font-semibold py-3 rounded-lg hover:bg-amber-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                )}
                <Link
                  to={`/combo/${deal._id || deal.id}`}
                  className="w-full bg-amber-50 text-amber-600 font-semibold py-2 rounded-lg hover:bg-amber-100 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Eye className="h-5 w-5" />
                  <span>View Combo</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;
