import { useInterview } from "../context/InterviewContext"

function FinalSummary() {

  const {
    finalSummary
  } = useInterview()

  return (
    <div className="mt-8 p-6 rounded-xl bg-gray-900 border border-gray-700 max-w-xl">
          <h2 className="text-xl font-semibold mb-4">
            Final Interview Result
          </h2>

          <p className="mb-2">
            <strong>Score:</strong> {finalSummary.score} / 10
          </p>

          <p className="mb-2">
            <strong>Verdict:</strong>{" "}
            <span className="uppercase">
              {finalSummary.verdict}
            </span>
          </p>

          {finalSummary.strengths?.length > 0 && (
            <div className="mt-3">
              <strong>Strengths</strong>
              <ul className="list-disc ml-5 text-sm text-gray-300">
                {finalSummary.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {finalSummary.weaknesses?.length > 0 && (
            <div className="mt-3">
              <strong>Weaknesses</strong>
              <ul className="list-disc ml-5 text-sm text-gray-300">
                {finalSummary.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {finalSummary.missing_points?.length > 0 && (
            <div className="mt-3">
              <strong>Missing Points</strong>
              <ul className="list-disc ml-5 text-sm text-gray-300">
                {finalSummary.missing_points.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
  )
}
export default FinalSummary