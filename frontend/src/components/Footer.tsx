import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="text-xl font-bold">Sri Sakhambari Enterprises</span>
            </div>
            <p className="text-amber-100 mb-4">
              Premium quality dry fruits and nuts sourced directly from the best farms. 
              Fresh, healthy, and naturally delicious.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/sunilkumar.talluri.1"
                className="text-xl font-bold hover:text-amber-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a
                href="https://maps.app.goo.gl/YZhNg6t6xtyXpWNW6"
                className="text-xl font-bold hover:text-amber-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-5 w-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/sunilkumartalluri/"
                className="text-xl font-bold hover:text-amber-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-amber-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-amber-200 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/contact" className="text-amber-200 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/about" className="text-amber-200 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products/almonds" className="text-amber-200 hover:text-white transition-colors">Badam</Link></li>
              <li><Link to="/products/cashews" className="text-amber-200 hover:text-white transition-colors">Kaju</Link></li>
              <li><Link to="/products/walnuts" className="text-amber-200 hover:text-white transition-colors">Akhrot</Link></li>
              <li><Link to="/products/raisins" className="text-amber-200 hover:text-white transition-colors">Kismis</Link></li>
              <li><Link to="/products/pistachios" className="text-amber-200 hover:text-white transition-colors">Pista</Link></li>
              <li><Link to="/products/dates" className="text-amber-200 hover:text-white transition-colors">Khajur</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <a
                href="https://maps.app.goo.gl/YZhNg6t6xtyXpWNW6"
                className="text-xl font-bold hover:text-amber-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-5 w-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a
                href="https://maps.app.goo.gl/YZhNg6t6xtyXpWNW6"
                
                target="_blank"
                rel="noopener noreferrer"
              >
              <span className="text-amber-100 text-sm">View on Google Maps</span>
              </a>
                
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-amber-200" />
                <span className="text-amber-100 text-sm">+91 9292101079</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-amber-200" />
                <span className="text-amber-100 text-sm">info@srisakhambari.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center">
          <p className="text-amber-200 text-sm">
            © 2024 Sri Sakhambari Enterprises. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;