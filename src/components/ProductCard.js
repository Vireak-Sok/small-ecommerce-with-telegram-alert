export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full uppercase">
          {product.type}
        </span>
      </div>
      
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-2 rounded-lg text-center">
          <p className="text-[10px] text-gray-400 uppercase">Price USD</p>
          <p className="font-bold text-green-600">${product.priceUSD}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg text-center">
          <p className="text-[10px] text-gray-400 uppercase">Price KHR</p>
          <p className="font-bold text-blue-600">{product.priceKHR}៛</p>
        </div>
      </div>

      <div className="border-t pt-4 flex justify-between items-center text-sm">
        <span className="text-gray-500">Stock: <b className={product.stock > 0 ? 'text-gray-800' : 'text-red-500'}>{product.stock}</b></span>
        {product.freeItems && (
          <span className="text-orange-500 font-medium italic">🎁 {product.freeItems}</span>
        )}
      </div>
    </div>
  );
}
