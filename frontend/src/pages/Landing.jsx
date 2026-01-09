import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Master your technical interview,
            <br />
            <span className="text-blue-500">before the real thing.</span>
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            Practice with an intelligent AI interviewer that listens, adapts,
            and provides instant, detailed feedback. Build confidence and refine
            your answers in a stress-free environment.
          </p>

          <div className="flex justify-center gap-4">
            {!user && (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
                >
                  Start practicing
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-900 transition font-medium"
                >
                  Sign in
                </button>
              </>
            )}

            {user && (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
                >
                  Go to dashboard
                </button>

                <button
                  onClick={() => navigate("/interview-setup")}
                  className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-900 transition font-medium"
                >
                  Start new session
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Trust / positioning */}
      <section className="px-6 py-12 border-t border-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold mb-2 text-white">
              Realistic Simulations
            </h3>
            <p className="text-sm text-gray-400">
              Experience the pressure of a live technical interview with dynamic
              follow-up questions based on your responses.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-white">Instant Feedback</h3>
            <p className="text-sm text-gray-400">
              Stop guessing how you did. Get immediate, objective scoring on
              your technical accuracy and communication clarity.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-white">
              Unlimited Attempts
            </h3>
            <p className="text-sm text-gray-400">
              Practice as many times as you need on different topics and
              difficulty levels until you feel ready.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
