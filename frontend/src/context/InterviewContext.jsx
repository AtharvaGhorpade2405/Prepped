import { createContext, useContext, useState } from "react";

const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | interview | finished
  const [status, setStatus] = useState("Idle");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [finalSummary, setFinalSummary] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [interviewLoading, setInterviewLoading]=useState(false)
  const [micActive, setMicActive] = useState(false);
  const [speaking,setSpeaking]=useState(false)
  const [evaluating,setEvaluating]=useState(false)

  const value = {
    started,
    setStarted,
    phase,
    setPhase,
    status,
    setStatus,
    currentQuestion,
    setCurrentQuestion,
    finalSummary,
    setFinalSummary,
    evaluations,
    setEvaluations,
    interviewLoading,
    setInterviewLoading,
    micActive,
    setMicActive,
    speaking,
    setSpeaking,
    evaluating,
    setEvaluating,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) {
    throw new Error("useInterview must be used inside InterviewProvider");
  }
  return ctx;
}
