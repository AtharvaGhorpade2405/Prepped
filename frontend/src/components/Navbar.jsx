import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="w-full px-6 py-4 border-b border-gray-800 bg-gray-950">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold tracking-wide">
          Prepped
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4 text-sm">
          {/* If NOT logged in */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
              >
                Get started
              </Link>
            </>
          )}

          {/* If logged in */}
          {user && (
            <>
              <Link
                to="/interview-setup"
                className="text-gray-300 hover:text-white transition"
              >
                Start Interview
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-900 transition text-gray-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
