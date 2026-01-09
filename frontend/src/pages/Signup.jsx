// src/pages/Signup.jsx
import Navbar from "../components/Navbar";

function Signup() {
  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Create your account
          </h2>

          <p className="text-sm text-gray-400 mb-6">
            Sign up using your Google account to start taking AI-powered
            interviews.
          </p>

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-2 rounded-md bg-white text-black cursor-pointer hover:bg-gray-200  transition font-medium"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>
        </div>
      </main>
    </div>
  );
}

export default Signup;
