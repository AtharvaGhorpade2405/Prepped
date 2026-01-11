import { useEffect, useRef } from "react";
import { useInterview } from "../context/InterviewContext";
import InterviewLoading from "../components/InterviewLoading";
import FinalSummary from "../components/FinalSummary";
import Question from "../components/Question";
import Status from "../components/Status";
import StartInterviewButton from "../components/StartInterviewButton";
import sendSummaryToBackend from "../services/sendSummary";
import VoiceIndicator from "../components/VoiceIndicator";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import InterviewTips from "../components/InterviewTips";

function Interview() {
  let {
    started,
    phase,
    status,
    currentQuestion,
    finalSummary,
    evaluating,
    interviewLoading,
    speaking,
    setStarted,
    setPhase,
    setStatus,
    setInterviewLoading,
    setMicActive,
    setEvaluating,
    setCurrentQuestion,
    setFinalSummary,
    setEvaluations,
    setSpeaking,
  } = useInterview();

  const { state } = useLocation();

  const interviewConfig = state || {
    topic: "General",
    difficulty: "medium",
    questions: 3,
  };

  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const micEnabledRef = useRef(true);

  useEffect( () => {
    async function askForMic(){

      const test = await navigator.mediaDevices.getUserMedia({ audio: true });
      return test
    }
    askForMic()
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) return;

    micEnabledRef.current = false;
    setSpeaking(true);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setStatus("Asking question…");
    };

    utterance.onend = () => {
      micEnabledRef.current = true;
      setStatus("Listening…");
      setSpeaking(false);
    };

    utterance.onerror = () => {
      micEnabledRef.current = true;
      setStatus("Listening…");
    };

    window.speechSynthesis.speak(utterance);
  };

  const cleanup = () => {
    window.speechSynthesis?.cancel();

    processorRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    wsRef.current?.close();
  };

  async function startInterview() {
    if (started) return;

    setStarted(true);
    setStatus("Connecting…");
    setInterviewLoading(true);

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = async () => {
      ws.send(
        JSON.stringify({
          type: "config",
          data: interviewConfig,
        })
      );
      setStatus("Starting interview...");
      setMicActive(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!micEnabledRef.current) return;
        if (ws.readyState !== WebSocket.OPEN) return;

        const input = e.inputBuffer.getChannelData(0);

        const pcm16 = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff;
        }

        ws.send(pcm16.buffer);
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case "question":
            setPhase("interview");
            setEvaluating(false);
            setInterviewLoading(false);
            setStatus("Starting interview...");
            setCurrentQuestion(msg.text);
            speak(msg.text);
            break;

          case "reprompt":
            setStatus(msg.text);
            break;

          case "evaluation":
            setEvaluating(true);
            setStatus("Evaluating answer...");
            setEvaluations((prev) => [...prev, msg.data]);
            break;

          case "end":
            window.speechSynthesis.cancel();
            setStatus("Interview complete");
            setPhase("finished");
            setCurrentQuestion(null);
            setEvaluations([])
            cleanup();
            break;

          case "final_summary": {
            setStatus("Saving interview...");

            const payload = {
              interview_id: msg.interview_id,
              timestamp: msg.timestamp,
              summary: msg.data,
              signature: msg.signature,
              topic:interviewConfig.topic
            };

            setFinalSummary(msg.data);

            const ok = await sendSummaryToBackend(
              payload,
              `${import.meta.env.VITE_BACKEND_URL}`
            );

            if (ok) {
              setStatus("Interview saved");
            } else {
              setStatus("Failed to save interview");
            }

            break;
          }

          default:
            console.warn("Unknown WS message:", msg);
        }
      } catch {
        console.warn("Non-JSON WS message", event.data);
      }
    };

    ws.onerror = () => {
      setStatus("Server error");
      setPhase("finished");
      setCurrentQuestion(null);
      setMicActive(false);
      cleanup();
    };

    ws.onclose = () => {
      setStatus("Connection lost");
      setPhase("finished");
      setCurrentQuestion(null);
      setMicActive(false);
      cleanup();
    };
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-6">

        {started && status && <Status />}

        {interviewLoading && <InterviewLoading />}

        {!started && <InterviewTips/>}
        {!started && <StartInterviewButton startInterview={startInterview} />}

        {phase === "interview" && currentQuestion && (
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-700">
            <VoiceIndicator
              mode={
                speaking ? "speaking" : evaluating ? "thinking" : "listening"
              }
              active={!evaluating}
            />
            <Question />
          </div>
        )}

        {phase === "finished" && finalSummary && <FinalSummary />}
      </div>
    </>
  );
}

export default Interview;
