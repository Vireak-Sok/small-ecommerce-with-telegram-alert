'use client';
import { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductDisplay({ initialProducts, types }) {
  const [activeTab, setActiveTab] = useState(types[0] || '');

  const filteredProducts = initialProducts.filter(p => p.type === activeTab);

  return (
    <>
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-200 pb-4">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === type 
              ? 'bg-gray-900 text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
