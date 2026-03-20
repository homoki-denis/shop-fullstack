import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/products"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          SHOP
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/products"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Produse
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/cart"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Coș
              </Link>
              <Link
                to="/orders"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Comenzi
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
