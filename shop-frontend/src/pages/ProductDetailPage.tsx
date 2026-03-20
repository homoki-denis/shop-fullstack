import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Product, CartItem } from "../types";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const saved = localStorage.getItem("cart");
    const cart: CartItem[] = saved ? JSON.parse(saved) : [];
    const existing = cart.find((item) => item.product.id === product.id);
    const updated = existing
      ? cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cart, { product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updated));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Se încarcă...</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate("/products")}
        className="text-sm text-gray-400 hover:text-gray-900 transition-colors mb-8 flex items-center gap-2"
      >
        ← Înapoi la produse
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50 h-64 flex items-center justify-center">
          <span className="text-8xl">🛍️</span>
        </div>

        <div className="p-8">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-6 mb-8">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toFixed(2)} lei
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                product.stock > 0
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {product.stock > 0 ? `${product.stock} în stoc` : "Stoc epuizat"}
            </span>
          </div>

          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            {added ? "✓ Adăugat în coș!" : "Adaugă în coș"}
          </button>
        </div>
      </div>
    </div>
  );
}
