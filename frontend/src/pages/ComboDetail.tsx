import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchDeals, fetchProducts } from '../data/products';

const ComboDetail: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const comboId = (params as any).comboId || (params as any).id;
  const { state, dispatch } = useCart();
  const [combo, setCombo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadComboDetails = async () => {
      setLoading(true);
      try {
        const [dealsData, productsData] = await Promise.all([fetchDeals(), fetchProducts()]);
        
        // Find the combo by ID
        const deal = dealsData.find((d: any) => (d._id === comboId || d.id === comboId));
        if (!deal) throw new Error('Combo not found');

        // Enrich with product details
        const enrichedDeal = {
          ...deal,
          products: deal.productIds
            .map((id: string) => productsData.find(p => p.id === id))
            .filter(Boolean)
        };
        setCombo(enrichedDeal);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching combo:', err);
        setError((err as any).message || 'Error fetching combo');
        setLoading(false);
      }
    };
    loadComboDetails();
  }, [comboId]);

  // Find if this combo is in the cart
  const cartItem = state.items.find(item => item.id === comboId);

  const handleAddToCart = () => {
    if (!combo) return;
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: combo._id || combo.id,
        type: 'deal',
        name: combo.title,
        price: combo.price ?? 0,
        image: combo.image,
        isDeal: true,
        dealProducts: combo.productIds
      }
    });
  };

  const handleIncrease = () => {
    if (!cartItem) return;
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        id: comboId,
        quantity: cartItem.quantity + 1
      }
    });
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity > 1) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: comboId,
          quantity: cartItem.quantity - 1
        }
      });
    } else {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: comboId
      });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !combo) return <div className="p-8 text-center text-red-600">{error || 'Combo not found'}</div>;

  const totalProductPrice = combo.products?.reduce((sum: number, p: any) => sum + (p.price ?? 0), 0) ?? 0;
  const savings = totalProductPrice - (combo.price ?? 0);

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
          <Link to="/deals" className="hover:text-amber-600">Deals</Link>
          <span>/</span>
          <span className="text-gray-900">{combo.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Combo Image */}
          <div className="space-y-4">
            <div>
              <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Combo Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{combo.title}</h1>
              {combo.description && (
                <p className="text-gray-600 mb-4">{combo.description}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold text-amber-600">₹{combo.price}</p>
                {combo.mrp && (
                  <p className="text-2xl text-gray-500 line-through">₹{combo.mrp}</p>
                )}
              </div>
              {savings > 0 && (
                <p className="text-green-600 font-semibold">
                  Save ₹{savings} (Individual price: ₹{totalProductPrice})
                </p>
              )}
            </div>

            {combo.discountPercentage > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-semibold">Special Offer: {combo.discountPercentage}% OFF</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">

                {/* Products in Combo - Next to Quantity */}
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Products Included</h3>
                  <div className="space-y-2">
                    {combo.products?.map((product: any) => (
                      <div key={product.id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-xs">{product.name}</p>
                          <p className="text-xs text-gray-600">
                            {product.type === 'weight' ? `250g • ₹${product.price}` : `1 unit • ₹${product.price}`}
                          </p>
                        </div>
                      </div>
                    ))}
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
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-24 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors text-center font-semibold text-sm"
                      >
                        View Cart
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
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

        {/* Products in Combo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combo.products?.map((product: any) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-amber-600">₹{product.price}</p>
                      <Link
                        to={`/product/${product.id}/detail`}
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Combo Summary */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Combo Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Number of Items:</span>
              <span className="font-semibold text-gray-900">{combo.products?.length || 0} items</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Individual Total Price:</span>
              <span className="font-semibold text-gray-900">₹{totalProductPrice}</span>
            </div>
            {combo.discountPercentage > 0 && (
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Discount ({combo.discountPercentage}%):</span>
                <span className="font-semibold text-green-600">-₹{(totalProductPrice * combo.discountPercentage / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-4 text-lg">
              <span className="font-bold text-gray-900">Combo Price:</span>
              <span className="font-bold text-amber-600">₹{combo.price}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between pt-2 text-green-600">
                <span className="font-semibold">You Save:</span>
                <span className="font-bold">₹{savings.toFixed(2)}</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComboDetail;
