// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Star, ShoppingCart } from 'lucide-react';
// import { useCart } from '../context/CartContext';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   type: string;
//   category: string;
//   rating: number;
// }

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const { dispatch } = useCart();

//   const handleAddToCart = () => {
//     dispatch({
//       type: 'ADD_TO_CART',
//       payload: {
//         id: product.id,
//         type: product.type,
//         name: product.name,
//         price: product.price,
//         image: product.image
//       }
//     });
//   };

//   return (
//     <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//       <div className="relative overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
//         />
//         <div className="absolute top-4 right-4 bg-amber-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
//           ${product.price}
//         </div>
//       </div>
      
//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
//           {product.name}
//         </h3>
        
//         <div className="flex items-center mb-3">
//           <div className="flex items-center">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`h-4 w-4 ${
//                   i < Math.floor(product.rating)
//                     ? 'text-yellow-400 fill-current'
//                     : 'text-gray-300'
//                 }`}
//               />
//             ))}
//           </div>
          
//         </div>

//         <div className="flex items-center justify-between">
//           <Link
//             to={`/product/${product.id}`}
//             className="text-amber-600 hover:text-amber-700 font-medium"
//           >
//             View Details
//           </Link>
//           <button
//             onClick={handleAddToCart}
//             className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-colors flex items-center space-x-2"
//           >
//             <ShoppingCart className="h-4 w-4" />
//             <span>Add to Cart</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;