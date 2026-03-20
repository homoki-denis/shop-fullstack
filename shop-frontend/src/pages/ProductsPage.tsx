import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import type { Product, CartItem } from "../types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...prev, { product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Se încarcă...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Produse</h1>
        <span className="text-sm text-gray-400">{products.length} produse</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          Nu există produse disponibile.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-50 h-48 flex items-center justify-center">
                <span className="text-5xl">🛍️</span>
              </div>

              <div className="p-5">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  {product.category}
                </span>
                <h2 className="text-gray-900 font-semibold mt-1 mb-3">
                  {product.name}
                </h2>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {product.price} lei
                  </span>
                  <span className="text-xs text-gray-400">
                    {product.stock} în stoc
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 text-center text-sm border border-gray-200 text-gray-600 py-2 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Detalii
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 text-sm bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40"
                  >
                    Adaugă
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
