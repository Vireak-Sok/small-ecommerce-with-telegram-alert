'use client';
import ProductCard from './ProductCard';

export default function ProductDisplay({ products }) {


  return (
    <>
      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
