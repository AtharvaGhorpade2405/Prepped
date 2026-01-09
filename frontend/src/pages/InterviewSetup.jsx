import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function InterviewSetup() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState(3);

  const handleStart = () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    navigate("/interview", {
      state: {
        topic,
        difficulty,
        questions,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Configure your interview
          </h2>

          <div className="space-y-4">
            {/* Topic */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-950 border border-gray-700 focus:outline-none focus:border-blue-600"
                placeholder="e.g. Operating Systems"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-950 border border-gray-700 focus:outline-none focus:border-blue-600"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Number of questions */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Number of questions
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={questions}
                onChange={(e) => setQuestions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md bg-gray-950 border border-gray-700 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              onClick={handleStart}
              className="w-full mt-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition font-medium"
            >
              Start interview
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InterviewSetup;
