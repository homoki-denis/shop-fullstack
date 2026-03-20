import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import type { CartItem } from "../types";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const updateQuantity = (productId: number, quantity: number) => {
    const updated =
      quantity === 0
        ? cart.filter((item) => item.product.id !== productId)
        : cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const placeOrder = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/orders", {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch {
      setError("Eroare la plasarea comenzii. Verifică stocul!");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Coșul tău</h1>
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🛒</div>
          <p>Coșul tău este gol.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Coșul tău</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center text-2xl">
              🛍️
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-400">{item.product.category}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                disabled={item.quantity >= item.product.stock}
                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-40"
              >
                +
              </button>
            </div>

            <span className="font-bold text-gray-900 w-24 text-right">
              {(item.product.price * item.quantity).toFixed(2)} lei
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            {total.toFixed(2)} lei
          </span>
        </div>
        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Se procesează..." : "Plasează comanda"}
        </button>
      </div>
    </div>
  );
}
