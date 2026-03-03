/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, Truck, ShieldCheck, Ruler, Package, ChevronDown, X, Trash2, ArrowLeft, Filter } from 'lucide-react';
import { supabase } from './lib/supabase';

// --- TYPES ---
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  custom: boolean;
  description: string;
  features: string[];
  image_urls?: string[];
  variants?: {
    colors?: string[];
    sizes?: string[];
    materials?: string[];
  }
};

type CartItem = Product & {
  cartId: string;
  selectedColor?: string;
  selectedSize?: string;
  selectedMaterial?: string;
  quantity: number;
};

type ViewState = 
  | { name: 'home' } 
  | { name: 'checkout' } 
  | { name: 'products', category?: string } 
  | { name: 'product', slug: string }
  | { name: 'admin' };

// --- HELPERS ---
const getImageUrl = (title: string, width = 800, height = 600) => {
  const seed = encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

const formatPrice = (price: number) => `Rs. ${price.toLocaleString()}`;

const useSEO = (title: string, description: string) => {
  useEffect(() => {
    document.title = `${title} | Lumina Furniture`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [title, description]);
};

// --- MAIN APP COMPONENT ---
function HomeView({ navigate, addToCart, products, categories }: { navigate: (v: ViewState) => void, addToCart: (p: Product, q?: number, s?: any) => void, products: Product[], categories: any[] }) {
  useSEO('Premium Furniture', 'Pakistan’s Largest Premium Furniture Collection. Factory Direct, Custom Made, Nationwide Delivery.');
  
  const displayCategories = categories.filter(c => !c.parent_id).slice(0, 8);

  return (
      <>
        {/* Hero Section */}
        <section className="relative w-full h-[80vh] bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={getImageUrl('premium living room setup', 1920, 1080)}
            alt="Premium Living Room Setup"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
              Pakistan’s Largest Premium Furniture Collection
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 font-light tracking-wide">
              Factory Direct | Custom Made | Nationwide Delivery
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate({ name: 'products' })} className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-medium text-sm tracking-widest uppercase hover:bg-gray-100 transition-colors rounded-none">
                Shop Living Room
              </button>
              <button onClick={() => navigate({ name: 'products' })} className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-medium text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors rounded-none">
                Explore Collection
              </button>
            </div>
          </div>
        </section>

        {/* Category Grid Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="h-[2px] bg-gray-900 w-12 md:w-24"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Bedroom Furniture</h2>
                <div className="h-[2px] bg-gray-900 w-12 md:w-24"></div>
              </div>
              <p className="text-gray-500 font-serif italic text-lg md:text-xl">Browse all Bedroom Furniture Categories Below!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {displayCategories.length > 0 ? displayCategories.map((cat) => (
                <div key={cat.id} onClick={() => navigate({ name: 'products', category: cat.name })} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-full aspect-[4/3] mb-4 flex items-center justify-center p-4 bg-white">
                    <img 
                      src={getImageUrl(cat.name, 400, 300)} 
                      alt={cat.name} 
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="w-full border border-gray-200 py-4 px-2 text-center bg-white transition-colors group-hover:border-gray-900">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{cat.name}</h3>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center text-gray-500 py-12">No categories available yet. Please add them in the Admin Dashboard.</div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-[#f9f9f9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-serif text-gray-900 uppercase tracking-widest">Featured Collection</h2>
              <button onClick={() => navigate({ name: 'products' })} className="text-sm font-medium text-gray-900 hover:underline underline-offset-4 uppercase tracking-wider">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="group flex flex-col h-full cursor-pointer" onClick={() => navigate({ name: 'product', slug: product.slug })}>
                  <div className="relative aspect-square bg-white mb-4 overflow-hidden border border-gray-100">
                    <img
                      src={product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : getImageUrl(product.name, 600, 600)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                      referrerPolicy="no-referrer"
                    />
                    {product.custom && (
                      <div className="absolute top-3 left-3 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 border border-gray-200 rounded-none z-10">
                        Customize Available
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-base font-medium text-gray-900 group-hover:underline underline-offset-4">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formatPrice(product.price)}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className="w-full mt-6 py-3 bg-white border border-gray-900 text-gray-900 text-sm font-medium uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors rounded-none"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Furniture Banner */}
        <section className="py-24 bg-[#e8e6e1]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6">
              Custom Furniture, Built To Your Space
            </h2>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
              Choose size, material and finish. We manufacture on demand to perfectly fit your home and lifestyle.
            </p>
            <button className="px-10 py-4 bg-gray-900 text-white font-medium text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors rounded-none">
              Request Quote
            </button>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center border border-gray-900 rounded-none mb-6">
                  <Package className="w-6 h-6 text-gray-900 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wider mb-2">Factory Direct Pricing</h3>
                <p className="text-sm text-gray-500">No middlemen. Direct from our manufacturing facility to your home.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center border border-gray-900 rounded-none mb-6">
                  <ShieldCheck className="w-6 h-6 text-gray-900 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wider mb-2">Premium Materials</h3>
                <p className="text-sm text-gray-500">Sourced globally, crafted locally with uncompromising quality standards.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center border border-gray-900 rounded-none mb-6">
                  <Ruler className="w-6 h-6 text-gray-900 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wider mb-2">Custom Sizes Available</h3>
                <p className="text-sm text-gray-500">Tailor-made dimensions to fit your specific spatial requirements.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center border border-gray-900 rounded-none mb-6">
                  <Truck className="w-6 h-6 text-gray-900 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wider mb-2">Nationwide Delivery</h3>
                <p className="text-sm text-gray-500">Safe, secure, and timely delivery across all major cities in Pakistan.</p>
              </div>
            </div>
          </div>
        </section>
      </>
  );
}

function ProductsView({ category, navigate, addToCart, products }: { category?: string, navigate: (v: ViewState) => void, addToCart: (p: Product, q?: number, s?: any) => void, products: Product[] }) {
  const displayedProducts = category 
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase()) 
    : products;
  
  const title = category ? `${category}` : 'All Products';
  const description = category ? `Browse our collection of ${category}.` : 'Browse our complete collection of premium furniture.';
  
  useSEO(title, description);

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-serif text-gray-900 uppercase tracking-widest">{title}</h1>
          <button className="flex items-center text-sm font-medium text-gray-900 uppercase tracking-wider">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Currently no products available</h2>
            <p className="text-gray-500 mb-8">We are working on adding new items to this category. Please check back later.</p>
            <button onClick={() => navigate({ name: 'products' })} className="px-8 py-4 bg-gray-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors">
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {displayedProducts.map((product) => (
              <div key={product.id} className="group flex flex-col h-full cursor-pointer" onClick={() => navigate({ name: 'product', slug: product.slug })}>
                <div className="relative aspect-square bg-white mb-4 overflow-hidden border border-gray-100">
                  <img
                    src={product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : getImageUrl(product.name, 600, 600)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                    referrerPolicy="no-referrer"
                  />
                  {product.custom && (
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 border border-gray-200 rounded-none z-10">
                      Customize Available
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-medium text-gray-900 group-hover:underline underline-offset-4">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatPrice(product.price)}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="w-full mt-6 py-3 bg-white border border-gray-900 text-gray-900 text-sm font-medium uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors rounded-none"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

function ProductDetailsView({ slug, navigate, addToCart, products }: { slug: string, navigate: (v: ViewState) => void, addToCart: (p: Product, q?: number, s?: any) => void, products: Product[] }) {
  const product = products.find(p => p.slug === slug);
  if (!product) return <div className="py-24 text-center text-xl font-serif">Product not found</div>;

  useSEO(product.name, product.description);

  const [color, setColor] = useState(product.variants?.colors?.[0] || '');
  const [size, setSize] = useState(product.variants?.sizes?.[0] || '');
  const [material, setMaterial] = useState(product.variants?.materials?.[0] || '');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const images = product.image_urls && product.image_urls.length > 0
    ? product.image_urls
    : [
        getImageUrl(product.name, 1000, 1000),
        getImageUrl(product.name + ' detail 1', 1000, 1000),
        getImageUrl(product.name + ' detail 2', 1000, 1000),
        getImageUrl(product.name + ' lifestyle', 1000, 1000),
      ];
  const [mainImage, setMainImage] = useState(images[0]);

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate({ name: 'products' })} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wider mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 border border-gray-200 overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" referrerPolicy="no-referrer" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)} 
                  className={`aspect-square border ${mainImage === img ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'} overflow-hidden transition-colors`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl text-gray-900 font-medium mb-6">{formatPrice(product.price)}</p>
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
            
            {/* Variants */}
            <div className="space-y-6 mb-8">
              {product.variants?.colors && (
                <div>
                  <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-3">Color: <span className="text-gray-500">{color}</span></label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.colors.map(c => (
                      <button key={c} onClick={() => setColor(c)} className={`px-4 py-2 text-sm border ${color === c ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-900'} transition-colors rounded-none`}>{c}</button>
                    ))}
                  </div>
                </div>
              )}
              {product.variants?.sizes && (
                <div>
                  <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-3">Size: <span className="text-gray-500">{size}</span></label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.sizes.map(s => (
                      <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 text-sm border ${size === s ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-900'} transition-colors rounded-none`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {product.variants?.materials && (
                <div>
                  <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-3">Material: <span className="text-gray-500">{material}</span></label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.materials.map(m => (
                      <button key={m} onClick={() => setMaterial(m)} className={`px-4 py-2 text-sm border ${material === m ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-900'} transition-colors rounded-none`}>{m}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 mt-auto">
              <div className="flex items-center border border-gray-300 w-full sm:w-auto">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-4 text-gray-600 hover:bg-gray-50 transition-colors">-</button>
                <span className="px-6 py-4 text-gray-900 font-medium text-center min-w-[3rem]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-4 text-gray-600 hover:bg-gray-50 transition-colors">+</button>
              </div>
              <button 
                onClick={() => addToCart(product, qty, { selectedColor: color, selectedSize: size, selectedMaterial: material })} 
                className="flex-1 py-4 bg-gray-900 text-white text-sm font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-none"
              >
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="flex space-x-8 border-b border-gray-200 mb-6">
                {['description', 'features', 'shipping'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {tab}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900"></span>}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[120px]">
                {activeTab === 'description' && (
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                )}
                {activeTab === 'features' && (
                  <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                    {product.features.map(f => <li key={f}>{f}</li>)}
                    {product.custom && <li>Customizable dimensions and materials available upon request.</li>}
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>Standard Delivery:</strong> 5-7 business days.</p>
                    <p><strong>White Glove Assembly:</strong> Available in select cities.</p>
                    <p><strong>Returns:</strong> 14-day return policy for standard items. Custom orders are non-refundable.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16 mt-8">
            <h2 className="text-2xl font-serif text-gray-900 uppercase tracking-widest mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {relatedProducts.map((related) => (
                <div key={related.id} className="group flex flex-col h-full cursor-pointer" onClick={() => { navigate({ name: 'product', slug: related.slug }); setMainImage(related.image_urls?.[0] || getImageUrl(related.name, 1000, 1000)); }}>
                  <div className="relative aspect-square bg-white mb-4 overflow-hidden border border-gray-100">
                    <img
                      src={related.image_urls && related.image_urls.length > 0 ? related.image_urls[0] : getImageUrl(related.name, 600, 600)}
                      alt={related.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow text-center">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:underline underline-offset-4">{related.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formatPrice(related.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
}

function CheckoutView({ cart, cartTotal }: { cart: CartItem[], cartTotal: number }) {
  useSEO('Checkout', 'Complete your secure purchase at Lumina Furniture.');

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif text-gray-900 uppercase tracking-widest mb-10">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-gray-900 uppercase tracking-wider mb-6 border-b border-gray-200 pb-2">Shipping Information</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">First Name</label>
                  <input type="text" className="w-full border border-gray-300 p-3 rounded-none focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Last Name</label>
                  <input type="text" className="w-full border border-gray-300 p-3 rounded-none focus:outline-none focus:border-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Address</label>
                <input type="text" className="w-full border border-gray-300 p-3 rounded-none focus:outline-none focus:border-gray-900" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">City</label>
                  <input type="text" className="w-full border border-gray-300 p-3 rounded-none focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Postal Code</label>
                  <input type="text" className="w-full border border-gray-300 p-3 rounded-none focus:outline-none focus:border-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                <input type="tel" className="w-full border border-gray-300 p-3 rounded-none focus:outline-none focus:border-gray-900" />
              </div>
            </form>

            <h2 className="text-lg font-medium text-gray-900 uppercase tracking-wider mb-6 mt-12 border-b border-gray-200 pb-2">Payment Method</h2>
            <div className="space-y-4">
              {['Credit / Debit Card', 'Cash on Delivery', 'Bank Transfer'].map((method, idx) => (
                <label key={method} className="flex items-center p-4 border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900" defaultChecked={idx === 0} />
                  <span className="ml-3 text-sm font-medium text-gray-900">{method}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-[400px]">
            <div className="bg-gray-50 p-6 border border-gray-200 sticky top-28">
              <h2 className="text-lg font-medium text-gray-900 uppercase tracking-wider mb-6 border-b border-gray-200 pb-2">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cart.length === 0 ? (
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="flex justify-between text-sm">
                      <div className="flex flex-col pr-4">
                        <span className="text-gray-900 font-medium truncate">{item.name} x{item.quantity}</span>
                        <span className="text-gray-500 text-xs mt-1">
                          {[item.selectedColor, item.selectedSize, item.selectedMaterial].filter(Boolean).join(' / ')}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">Calculated at next step</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                  <span className="text-base font-medium text-gray-900 uppercase tracking-wider">Total</span>
                  <span className="text-xl font-serif text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <button 
                className="w-full mt-8 py-4 bg-gray-900 text-white text-sm font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={cart.length === 0}
                onClick={() => alert('Order placed successfully!')}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

function AdminView({ onDataChange }: { onDataChange: () => void }) {
  useSEO('Admin Dashboard', 'Manage products and categories.');
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', slug: '', parent_id: '' });

  const [showProdForm, setShowProdForm] = useState(false);
  const [prodForm, setProdForm] = useState({ name: '', slug: '', base_price: '', category_id: '', description: '', is_customizable: false });
  const [prodImages, setProdImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    const [cRes, pRes, colRes] = await Promise.all([
      supabase.from('categories').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('collections').select('*').order('created_at', { ascending: false })
    ]);
    if (cRes.data) setCategories(cRes.data);
    if (pRes.data) setProducts(pRes.data);
    if (colRes.data) setCollections(colRes.data);
    setLoading(false);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('categories').insert([{ 
      name: catForm.name, 
      slug: catForm.slug, 
      parent_id: catForm.parent_id || null 
    }]);
    if (!error) {
      setShowCatForm(false);
      setCatForm({ name: '', slug: '', parent_id: '' });
      fetchAdminData();
      onDataChange();
    } else alert(error.message);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchAdminData();
    onDataChange();
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prodImages.length === 0 || prodImages.length > 4) {
      alert('Please upload between 1 and 4 images.');
      return;
    }

    setUploading(true);
    const imageUrls: string[] = [];

    for (const file of prodImages) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        alert(`Error uploading image: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      imageUrls.push(data.publicUrl);
    }

    const { error } = await supabase.from('products').insert([{ 
      name: prodForm.name, 
      slug: prodForm.slug, 
      base_price: Number(prodForm.base_price),
      category_id: prodForm.category_id,
      description: prodForm.description,
      is_customizable: prodForm.is_customizable,
      image_urls: imageUrls
    }]);
    
    setUploading(false);

    if (!error) {
      setShowProdForm(false);
      setProdForm({ name: '', slug: '', base_price: '', category_id: '', description: '', is_customizable: false });
      setProdImages([]);
      fetchAdminData();
      onDataChange();
    } else alert(error.message);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchAdminData();
    onDataChange();
  };

  if (loading) return <div className="py-24 text-center">Loading Admin Data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif text-gray-900 uppercase tracking-widest mb-10">Admin Dashboard</h1>
      
      <div className="flex space-x-8 border-b border-gray-200 mb-8">
        {['categories', 'products', 'collections'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900"></span>}
          </button>
        ))}
      </div>

      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Manage Categories</h2>
            <button onClick={() => setShowCatForm(!showCatForm)} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors">
              {showCatForm ? 'Cancel' : 'Add Category'}
            </button>
          </div>

          {showCatForm && (
            <form onSubmit={handleCreateCategory} className="bg-gray-50 p-6 border border-gray-200 mb-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input required placeholder="Name" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="border p-2" />
                <input required placeholder="Slug (e.g. living-room)" value={catForm.slug} onChange={e => setCatForm({...catForm, slug: e.target.value})} className="border p-2" />
                <select value={catForm.parent_id} onChange={e => setCatForm({...catForm, parent_id: e.target.value})} className="border p-2">
                  <option value="">No Parent (Main Category)</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm uppercase">Save Category</button>
            </form>
          )}

          <div className="bg-white border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Slug</th>
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">{cat.parent_id ? `— ${cat.name}` : cat.name}</td>
                    <td className="p-4 text-sm text-gray-500">{cat.slug}</td>
                    <td className="p-4 text-sm text-right space-x-4">
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-500">No categories found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Manage Products</h2>
            <button onClick={() => setShowProdForm(!showProdForm)} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors">
              {showProdForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {showProdForm && (
            <form onSubmit={handleCreateProduct} className="bg-gray-50 p-6 border border-gray-200 mb-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Name" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} className="border p-2" />
                <input required placeholder="Slug" value={prodForm.slug} onChange={e => setProdForm({...prodForm, slug: e.target.value})} className="border p-2" />
                <input required type="number" placeholder="Base Price" value={prodForm.base_price} onChange={e => setProdForm({...prodForm, base_price: e.target.value})} className="border p-2" />
                <select required value={prodForm.category_id} onChange={e => setProdForm({...prodForm, category_id: e.target.value})} className="border p-2">
                  <option value="">Select Category</option>
                  {categories.filter(c => !c.parent_id).map(mainCat => (
                    <React.Fragment key={mainCat.id}>
                      <option value={mainCat.id} className="font-bold">{mainCat.name}</option>
                      {categories.filter(c => c.parent_id === mainCat.id).map(subCat => (
                        <option key={subCat.id} value={subCat.id}>&nbsp;&nbsp;&nbsp;-- {subCat.name}</option>
                      ))}
                    </React.Fragment>
                  ))}
                </select>
                <textarea placeholder="Description" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} className="border p-2 sm:col-span-2" />
                <div className="sm:col-span-2 border p-4 bg-white">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (1 to 4 images)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={e => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 4) {
                        alert('Maximum 4 images allowed');
                        e.target.value = '';
                      } else {
                        setProdImages(files);
                      }
                    }} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" 
                  />
                  {prodImages.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">{prodImages.length} image(s) selected</p>
                  )}
                </div>
                <label className="flex items-center space-x-2 sm:col-span-2">
                  <input type="checkbox" checked={prodForm.is_customizable} onChange={e => setProdForm({...prodForm, is_customizable: e.target.checked})} />
                  <span className="text-sm">Is Customizable?</span>
                </label>
              </div>
              <button type="submit" disabled={uploading} className="px-6 py-2 bg-gray-900 text-white text-sm uppercase disabled:bg-gray-400">
                {uploading ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          )}

          <div className="bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Product</th>
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900 font-medium">{prod.name}</td>
                    <td className="p-4 text-sm text-gray-500">{prod.categories?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-gray-900">Rs. {Number(prod.base_price).toLocaleString()}</td>
                    <td className="p-4 text-sm text-right space-x-4">
                      <button onClick={() => handleDeleteProduct(prod.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No products found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'collections' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Manage Collections</h2>
            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors">Create Collection</button>
          </div>
          <div className="bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Collection Name</th>
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Products Count</th>
                  <th className="p-4 text-sm font-medium text-gray-900 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map(col => (
                  <tr key={col.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900 font-medium">{col.name}</td>
                    <td className="p-4 text-sm text-gray-500">{col.product_ids?.length || 0} Products</td>
                    <td className="p-4 text-sm text-right space-x-4">
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {collections.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-500">No collections found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<ViewState>({ name: 'home' });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const { data: categoriesData } = await supabase.from('categories').select('*');
      const { data: productsData } = await supabase.from('products').select('*');
      
      if (categoriesData) setCategories(categoriesData);

      if (productsData && categoriesData) {
        const mappedProducts: Product[] = productsData.map(p => {
          const cat = categoriesData.find(c => c.id === p.category_id);
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.base_price),
            category: cat ? cat.name : 'Uncategorized',
            custom: p.is_customizable,
            description: p.description || '',
            features: ['Premium Quality', 'Nationwide Delivery'], // Default features
            variants: { colors: ['Standard'], sizes: ['Standard'] } // Default variants
          };
        });
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navigate = (newView: ViewState) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, quantity = 1, selections = {}) => {
    setCart([...cart, { ...product, cartId: Math.random().toString(), quantity, ...selections }]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-serif uppercase tracking-widest">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <ShoppingCart className="w-12 h-12 opacity-20" />
                  <p className="uppercase tracking-wider text-sm">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex items-center gap-4">
                      <div className="w-20 h-20 border border-gray-200 overflow-hidden relative">
                        <img src={getImageUrl(item.name, 100, 100)} alt={item.name} className="w-full h-full object-cover absolute inset-0" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {[item.selectedColor, item.selectedSize, item.selectedMaterial].filter(Boolean).join(' / ')}
                        </p>
                        <p className="text-sm text-gray-900 font-medium mt-1">{formatPrice(item.price)} <span className="text-gray-500 font-normal text-xs">x{item.quantity}</span></p>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">Subtotal</span>
                  <span className="text-lg font-serif text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); navigate({ name: 'checkout' }); }}
                  className="w-full py-4 bg-gray-900 text-white text-sm font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-none"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate({ name: 'home' })}>
              <span className="font-serif text-2xl font-bold tracking-tight text-gray-900 uppercase">
                Lumina
              </span>
            </div>

            {/* Menu */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {/* Products Dropdown */}
              <div className="group relative h-full">
                <button onClick={() => navigate({ name: 'products' })} className="flex items-center text-xs xl:text-sm font-medium text-gray-600 hover:text-gray-900 h-20 uppercase tracking-wider">
                  Collection <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <div className="absolute top-20 left-0 w-56 bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="flex flex-col py-2">
                    <button onClick={() => navigate({ name: 'products' })} className="px-6 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 uppercase tracking-wider text-left w-full">
                      All Products
                    </button>
                    {categories.filter(c => !c.parent_id).map((cat) => (
                      <button key={cat.id} onClick={() => navigate({ name: 'products', category: cat.name })} className="px-6 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 uppercase tracking-wider text-left w-full">
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Furniture By Category Mega Menu */}
              <div className="group h-full">
                <button className="flex items-center text-xs xl:text-sm font-medium text-gray-600 hover:text-gray-900 h-20 uppercase tracking-wider">
                  Furniture By Category <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-4 gap-8">
                      {/* Living Room */}
                      <div>
                        <div onClick={() => navigate({ name: 'products', category: 'Living Room' })} className="relative h-40 mb-6 bg-gray-100 overflow-hidden group/cat cursor-pointer">
                          <img src={getImageUrl('living room furniture', 400, 300)} alt="Living Room" className="w-full h-full object-cover transition-transform duration-700 group-hover/cat:scale-105" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3 className="text-white font-serif text-2xl tracking-widest uppercase">Living Room</h3>
                          </div>
                        </div>
                        <ul className="space-y-3">
                          {['Sofas & Sectionals', 'Coffee Tables', 'TV Consoles', 'Lounge Chairs', 'Side Tables'].map(sub => (
                            <li key={sub}><button onClick={() => navigate({ name: 'products', category: sub })} className="text-sm text-gray-500 hover:text-gray-900 hover:underline underline-offset-4">{sub}</button></li>
                          ))}
                        </ul>
                      </div>
                      {/* Bedroom */}
                      <div>
                        <div onClick={() => navigate({ name: 'products', category: 'Bedroom' })} className="relative h-40 mb-6 bg-gray-100 overflow-hidden group/cat cursor-pointer">
                          <img src={getImageUrl('bedroom furniture', 400, 300)} alt="Bedroom" className="w-full h-full object-cover transition-transform duration-700 group-hover/cat:scale-105" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3 className="text-white font-serif text-2xl tracking-widest uppercase">Bedroom</h3>
                          </div>
                        </div>
                        <ul className="space-y-3">
                          {['Beds', 'Wardrobes', 'Nightstands', 'Dressers', 'Mattresses'].map(sub => (
                            <li key={sub}><button onClick={() => navigate({ name: 'products', category: sub })} className="text-sm text-gray-500 hover:text-gray-900 hover:underline underline-offset-4">{sub}</button></li>
                          ))}
                        </ul>
                      </div>
                      {/* Dining */}
                      <div>
                        <div onClick={() => navigate({ name: 'products', category: 'Dining' })} className="relative h-40 mb-6 bg-gray-100 overflow-hidden group/cat cursor-pointer">
                          <img src={getImageUrl('dining room furniture', 400, 300)} alt="Dining" className="w-full h-full object-cover transition-transform duration-700 group-hover/cat:scale-105" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3 className="text-white font-serif text-2xl tracking-widest uppercase">Dining</h3>
                          </div>
                        </div>
                        <ul className="space-y-3">
                          {['Dining Tables', 'Dining Chairs', 'Sideboards', 'Bar Stools', 'Dining Sets'].map(sub => (
                            <li key={sub}><button onClick={() => navigate({ name: 'products', category: sub })} className="text-sm text-gray-500 hover:text-gray-900 hover:underline underline-offset-4">{sub}</button></li>
                          ))}
                        </ul>
                      </div>
                      {/* Office */}
                      <div>
                        <div onClick={() => navigate({ name: 'products', category: 'Office' })} className="relative h-40 mb-6 bg-gray-100 overflow-hidden group/cat cursor-pointer">
                          <img src={getImageUrl('home office furniture', 400, 300)} alt="Office" className="w-full h-full object-cover transition-transform duration-700 group-hover/cat:scale-105" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3 className="text-white font-serif text-2xl tracking-widest uppercase">Office</h3>
                          </div>
                        </div>
                        <ul className="space-y-3">
                          {['Office Desks', 'Ergonomic Chairs', 'Bookshelves', 'Filing Cabinets', 'Conference Tables'].map(sub => (
                            <li key={sub}><button onClick={() => navigate({ name: 'products', category: sub })} className="text-sm text-gray-500 hover:text-gray-900 hover:underline underline-offset-4">{sub}</button></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Links */}
              {[
                'Wedding Packages',
                'Blog',
                'About',
                'Contact'
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="flex items-center text-xs xl:text-sm font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wider h-20 hover:underline underline-offset-4"
                >
                  {item}
                </a>
              ))}
              
              {/* Special Offers */}
              <a
                href="#special-offers"
                className="flex items-center text-xs xl:text-sm font-bold text-gray-900 hover:text-gray-600 uppercase tracking-wider h-20 hover:underline underline-offset-4"
              >
                Special Offers!
              </a>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button 
                className="text-gray-600 hover:text-gray-900 transition-colors relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-none">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-xl font-serif text-gray-500 uppercase tracking-widest animate-pulse">Loading...</div>
          </div>
        ) : (
          <>
            {view.name === 'home' && <HomeView navigate={navigate} addToCart={addToCart} products={products} categories={categories} />}
            {view.name === 'products' && <ProductsView category={view.category} navigate={navigate} addToCart={addToCart} products={products} />}
            {view.name === 'product' && <ProductDetailsView slug={view.slug} navigate={navigate} addToCart={addToCart} products={products} />}
            {view.name === 'checkout' && <CheckoutView cart={cart} cartTotal={cartTotal} />}
            {view.name === 'admin' && <AdminView onDataChange={loadData} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white pt-20 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight uppercase mb-6 block">
                Lumina
              </span>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Crafting premium furniture with uncompromising quality and timeless design.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Shop</h4>
              <ul className="space-y-4">
                {['Living Room', 'Bedroom', 'Dining', 'Office Furniture', 'New Arrivals'].map((item) => (
                  <li key={item}>
                    <button onClick={() => navigate({ name: 'products' })} className="text-gray-400 hover:text-white text-sm transition-colors text-left">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Customer Care</h4>
              <ul className="space-y-4">
                {['Contact Us', 'Delivery Information', 'Returns & Exchanges', 'Care Guide', 'FAQs'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">About</h4>
              <ul className="space-y-4">
                {['Our Story', 'Our Factory', 'Quality Process', 'Sustainability', 'Careers'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigate({ name: 'admin' })} className="text-gray-400 hover:text-white text-sm transition-colors text-left">
                    Admin Dashboard
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; 2026 Lumina Furniture. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
