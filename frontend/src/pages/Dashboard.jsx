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
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/mine`, {
          credentials: "include",
        });
        const data = await res.json();
        setInterviews(data);
      } catch {
        setInterviews([]);
      } finally {
        setFetching(false);
      }
    }

    fetchInterviews();
  }, [user]);

  if (loading || fetching) {
    return <div className="p-6 text-gray-300">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6">
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
