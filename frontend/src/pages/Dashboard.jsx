import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import InterviewCard from "../components/InterviewCard";

function Dashboard() {
  const { user, loading } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [fetching, setFetching] = useState(true);

useEffect(() => {
    if (!user) return;

    async function fetchInterviews() {
      // 1. Get the token we saved during login
      const token = localStorage.getItem("auth_token");

      if (!token) {
        console.error("No token found");
        setFetching(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/mine`, {
          method: "GET",
          headers: {
            // 🚨 CRITICAL CHANGE: Send the token here
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setInterviews(data);
        } else {
          // If 401 (Unauthorized), the token might be expired.
          console.error("Failed to fetch interviews");
          if (res.status === 401) {
             // Optional: Force logout if token is bad
             // localStorage.removeItem("token");
             // window.location.href = "/login";
          }
        }
      } catch (err) {
        console.error(err);
        setInterviews([]);
      } finally {
        setFetching(false);
      }
    }

    fetchInterviews();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6">
        {(loading || fetching ) && <p>Loading...</p>}
        <h1 className="text-2xl font-semibold mb-6">Your Interviews</h1>

        {interviews.length === 0 && (
          <p className="text-gray-400">You haven’t taken any interviews yet.</p>
        )}

        <div className="space-y-4">
          {interviews.map((interview) => (
            <InterviewCard key={interview._id} i={interview} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
