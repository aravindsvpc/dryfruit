import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Truck, Shield, Clock, ShoppingCart, Eye, ChevronLeft, ChevronRight, Package, Zap, Award, Globe, MessageCircle, Check } from 'lucide-react';
import { getFlatProductList, fetchDeals, fetchProducts, fetchShopCategories, ShopCategory } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductVarietyCard from '../components/ProductVarietyCard';

// Install react-slick and slick-carousel before using:
// npm install react-slick slick-carousel
import Slider, { type Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home: React.FC = () => {
  const { state, dispatch } = useCart();
  const [allProducts, setAllProducts] = React.useState<any[]>([]);
  const [dealsWithProducts, setDealsWithProducts] = React.useState<any[]>([]);
  const [shopCategories, setShopCategories] = React.useState<ShopCategory[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(true);
  const [isLoadingDeals, setIsLoadingDeals] = React.useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);

  React.useEffect(() => {
    setIsLoadingProducts(true);
    getFlatProductList().then((products) => {
      setAllProducts(
        products.map((product: any) => ({
          ...product,
          productId: product.productId ?? product.id ?? '',
        }))
      );
      setIsLoadingProducts(false);
    });
    
    setIsLoadingDeals(true);
    Promise.all([fetchDeals(), fetchProducts()])
      .then(([dealsData, productsData]) => {
        const enriched = dealsData
          .filter((deal: any) => deal.active !== false)
          .map((deal: any) => ({
            ...deal,
            products: deal.productIds
              .map((id: string) => productsData.find(p => p.id === id))
              .filter(Boolean)
          }));
        setDealsWithProducts(enriched);
        setIsLoadingDeals(false);
      })
      .catch(err => {
        console.error('Error fetching deals:', err);
        setIsLoadingDeals(false);
      });

    setIsLoadingCategories(true);
    fetchShopCategories()
      .then(setShopCategories)
      .catch(err => console.error('Error fetching shop categories:', err))
      .finally(() => setIsLoadingCategories(false));
  }, []);
  const featuredProducts = allProducts.slice(0, 4);

  const handleAddDealToCart = (deal: any) => {
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

  const getDealCartItem = (deal: any) => {
    return state.items.find(item => item.id === (deal._id || deal.id));
  };

  const handleIncreaseDeal = (deal: any) => {
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

  const handleDecreaseDeal = (deal: any) => {
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

  let sliderRef = React.useRef<any>(null);

  const handlePrevArrow = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNextArrow = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <div className="min-h-screen">
      {/* Category Navigation Section */}
      <section className="py-12 bg-gradient-to-b from-white to-amber-50 relative" style={{ backgroundImage: 'url("http://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/GeminiBanner.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="max-w-8xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Browse our premium collection of dry fruits and nuts</p>
          </div>
          {isLoadingCategories ? (
            <div className="flex justify-center items-center h-40">
              <div className="inline-flex gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : shopCategories.length > 0 ? (
            <div className="relative">
              <Slider
                ref={sliderRef}
                dots={true}
                infinite={shopCategories.length > 1}
                speed={500}
                slidesToShow={6}
                slidesToScroll={1}
                autoplay={shopCategories.length > 1}
                autoplaySpeed={4000}
                responsive={[
                  { breakpoint: 1280, settings: { slidesToShow: 5 } },
                  { breakpoint: 1024, settings: { slidesToShow: 4 } },
                  { breakpoint: 768, settings: { slidesToShow: 3 } },
                  { breakpoint: 640, settings: { slidesToShow: 2 } }
                ]}
                className="-mx-2"
              >
                {shopCategories.map((category) => (
                  <div key={category.id} className="px-3">
                    <Link to={category.link} className="flex flex-col items-center group cursor-pointer relative">
                      <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ring-2 ring-white group-hover:ring-4 group-hover:ring-amber-300`}>
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-gray-900 text-center group-hover:text-amber-600 transition-colors">{category.name}</p>
                    </Link>
                  </div>
                ))}
              </Slider>
              {/* Left Arrow */}
              <button
                onClick={handlePrevArrow}
                className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-amber-50 hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6 text-amber-600" />
              </button>
              {/* Right Arrow */}
              <button
                onClick={handleNextArrow}
                className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-amber-50 hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6 text-amber-600" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {/* Fallback - Combo Offers */}
              <Link to="/deals" className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
                  <img src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" alt="Combo Offers" className="w-full h-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 text-center">Combo Offers</p>
              </Link>

              {/* Almonds */}
              <Link to="/products/Almonds" className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
                  <img src="https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/Almonds.jpg" alt="Almonds" className="w-full h-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 text-center">Almonds</p>
              </Link>

              {/* Cashews */}
              <Link to="/products/Kaju" className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
                  <img src="https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/Kaju.jpg" alt="Cashews" className="w-full h-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 text-center">Cashews</p>
              </Link>

              {/* Walnuts */}
              <Link to="/products/Walnuts" className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
                  <img src="https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/Walnut.jpg" alt="Walnuts" className="w-full h-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 text-center">Walnuts</p>
              </Link>

              {/* Dates */}
              <Link to="/products/Dates" className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
                  <img src="https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/Dates.jpg" alt="Dates" className="w-full h-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 text-center">Dates</p>
              </Link>

              {/* All Products */}
              <Link to="/products" className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
                  <img src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" alt="All Products" className="w-full h-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 text-center">All Products</p>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Today's Deals Section */}
      
      {/* Combos Section - Deals Carousel */}
      <section className="py-12 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Combo Offers</h2>
              <p className="text-gray-600 mt-2">Limited time bundles with amazing discounts</p>
            </div>
            <Link to="/deals" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer group">
              View all deals <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {isLoadingDeals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-44 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : dealsWithProducts.length > 0 ? (
            <Slider
              dots={true}
              infinite={true}
              speed={600}
              slidesToShow={3}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={4000}
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 2 } },
                { breakpoint: 640, settings: { slidesToShow: 1 } }
              ]}
              className="-mx-3"
            >
              {dealsWithProducts.map((deal: any) => (
                <div key={deal._id || deal.id} className="px-3">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col min-h-[480px]">
                    {/* Image */}
                    <div className="relative w-full h-44 bg-gradient-to-br from-amber-100 to-amber-50 overflow-hidden group">
                      {deal.image ? (
                        <img src={deal.image} alt={deal.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-200">
                          <ShoppingCart className="h-12 w-12" />
                        </div>
                      )}
                      {deal.price && (
                        <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1">
                          <div className="bg-white rounded-lg shadow-lg px-3 py-1.5 font-bold text-amber-700 text-sm">
                            ₹{deal.price}
                          </div>
                          {deal.mrp && (
                            <div className="bg-red-100 rounded-lg shadow-lg px-2 py-0.5 font-bold text-red-700 text-xs line-through">
                              ₹{deal.mrp}
                            </div>
                          )}
                        </div>
                      )}
                      {deal.discountPercentage > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-3 py-1 font-bold text-sm shadow-lg">
                          {deal.discountPercentage}% OFF
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{deal.title}</h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{deal.description}</p>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                            {deal.products?.length || 0} Items
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart / Quantity Control */}
                      <div className="space-y-2">
                        {getDealCartItem(deal) ? (
                          <div className="flex items-center gap-2 justify-between w-full">
                            <div className="flex items-center rounded-lg justify-center h-9 bg-amber-50">
                              <button
                                onClick={() => handleDecreaseDeal(deal)}
                                className="px-2 py-1 hover:bg-amber-50 text-amber-600 font-bold text-sm"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 font-semibold text-amber-600 text-sm">
                                {getDealCartItem(deal)?.quantity}
                              </span>
                              <button
                                onClick={() => handleIncreaseDeal(deal)}
                                className="px-2 py-1 hover:bg-amber-50 text-amber-600 font-bold text-sm"
                              >
                                +
                              </button>
                            </div>
                            <Link
                              to="/cart"
                              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 text-center font-semibold text-xs whitespace-nowrap flex-1 py-2"
                            >
                              View Cart
                            </Link>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddDealToCart(deal)}
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-2 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 flex items-center justify-center gap-2 text-sm active:scale-95 cursor-pointer hover:shadow-lg"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                        <Link
                          to={`/combo/${deal._id || deal.id}`}
                          className="w-full bg-amber-50 text-amber-600 font-semibold py-2 rounded-lg hover:bg-amber-100 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm active:scale-95 cursor-pointer group"
                        >
                          <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>View Combo</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-12 text-gray-600 bg-white rounded-lg">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">No combo offers available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="mb-6 animate-fade-in" style={{ animation: 'fadeIn 1s ease-out' }}>
            <span className="inline-block bg-amber-100 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🌟 Sri Sakhambari Enterprises
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animation: 'fadeIn 1.2s ease-out' }}>
            Premium Dry Fruits <span className="text-amber-100">&</span> Nuts
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 text-amber-50 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animation: 'fadeIn 1.4s ease-out' }}>
            Freshly sourced, naturally pure, and packed with nutrition. Discover the finest quality dry fruits delivered to your doorstep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animation: 'fadeIn 1.6s ease-out' }}>
            <Link
              to="/products"
              className="bg-white text-amber-800 px-8 py-4 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="bg-amber-100 text-amber-800 px-8 py-4 rounded-lg font-semibold hover:bg-amber-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer active:scale-95 group hover:shadow-xl"
            >
              <MessageCircle className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
              Contact Us
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-amber-50 animate-fade-in" style={{ animation: 'fadeIn 1.8s ease-out' }}>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-amber-200" />
              <span>100% Natural</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-amber-200" />
              <span>Fresh Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-amber-200" />
              <span>Direct Imports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600">Experience the best quality and service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Quality Guarantee</h3>
              <p className="text-gray-600 text-sm">100% satisfaction guaranteed with our premium selection</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                <Zap className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Fresh Daily</h3>
              <p className="text-gray-600 text-sm">Processed and packed fresh daily for maximum nutrition</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Handpicked premium products from trusted sources</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                <Globe className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Direct Imports</h3>
              <p className="text-gray-600 text-sm">No intermediary - directly imported from the source</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-2">Hand-picked selection of our best-sellers</p>
            </div>
            <Link to="/products" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer group">
              Shop all <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductVarietyCard key={product.id} variety={product}  />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Browse our extensive collection of premium dry fruits and nuts
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Badam', category: 'almonds', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
              { name: 'Kaju', category: 'cashews', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
              { name: 'Akhrot', category: 'walnuts', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
              { name: 'Kismis', category: 'raisins', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
              { name: 'Pista', category: 'pistachios', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
              { name: 'Khajur', category: 'dates', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products/${category.category}`}
                className="group text-center"
              >
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Newsletter Section */}
      {/* <section className="py-16 bg-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Get the latest updates on new products, special offers, and health tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button className="bg-amber-800 px-8 py-3 rounded-full font-semibold hover:bg-amber-900 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;