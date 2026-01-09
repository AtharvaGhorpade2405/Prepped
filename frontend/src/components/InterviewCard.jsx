import { useState } from "react";

export default function InterviewCard({ i }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
      {/* --- Header Section --- */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{i.topic}</p>
          <p className="text-sm text-gray-400">
            {new Date(i.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">{i.final_summary.score} / 10</p>
          <p
            className={`text-sm ${
              i.final_summary.verdict === "pass"
                ? "text-green-400"
                : i.final_summary.verdict === "borderline"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {i.final_summary.verdict.toUpperCase()}
          </p>
        </div>
      </div>

      {/* --- Toggle Button & Content --- */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
        >
          {isOpen ? "Hide Evaluations" : "Show Evaluations"}
        </button>

        {isOpen && (
          <div className="mt-8 p-6 rounded-xl bg-gray-900 border border-gray-700 max-w-xl">
            <h2 className="text-xl font-semibold mb-4">
              Final Interview Result
            </h2>

            <p className="mb-2">
              <strong>Score:</strong> {i.final_summary.score} / 10
            </p>

            <p className="mb-2">
              <strong>Verdict:</strong>{" "}
              <span className="uppercase">{i.final_summary.verdict}</span>
            </p>

            {i.final_summary.strengths?.length > 0 && (
              <div className="mt-3">
                <strong>Strengths</strong>
                <ul className="list-disc ml-5 text-sm text-gray-300">
                  {i.final_summary.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {i.final_summary.weaknesses?.length > 0 && (
              <div className="mt-3">
                <strong>Weaknesses</strong>
                <ul className="list-disc ml-5 text-sm text-gray-300">
                  {i.final_summary.weaknesses.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {i.final_summary.missing_points?.length > 0 && (
              <div className="mt-3">
                <strong>Missing Points</strong>
                <ul className="list-disc ml-5 text-sm text-gray-300">
                  {i.final_summary.missing_points.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};