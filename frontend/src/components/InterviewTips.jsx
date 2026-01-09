import { FaClock, FaMicrophoneAlt, FaBrain, FaCheckCircle } from "react-icons/fa";

const InterviewTips = () => {
  const tips = [
    {
      icon: <FaClock />,
      title: "Time Limit per Answer",
      description:
        "Each response has a strict maximum duration of 90 seconds (1.5 minutes). Keep your answers concise and focused. The recording will cut off automatically if you exceed this time.",
    },
    {
      icon: <FaMicrophoneAlt />,
      title: "Silence auto-submits",
      description:
        "Once you begin speaking, the AI listens for pauses. If you remain silent for 3 seconds, the system will consider your answer complete and send it for evaluation.",
    },
    {
      icon: <FaBrain />,
      title: "Gather your thoughts",
      description:
        "Before you start speaking, it's okay to take a few moments to structure your answer. The 3-second silence timer only kicks in *after* you have started talking.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Speak Clearly",
      description:
        "Ensure you are in a quiet environment. Speak at a moderate pace and articulate clearly so the AI can accurately transcribe and evaluate your technical points.",
    },
  ];

  return (
    <section className="w-full bg-gray-950 py-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">
            Interview Rules & Tips
          </h2>
          <p className="text-gray-400">
            Review these guidelines to ensure a smooth practice session.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-blue-900/5">
          <div className="grid gap-8 md:grid-cols-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Icon Box */}
                <div className="shrink-0 p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-blue-400 text-xl">
                  {tip.icon}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Ready to begin? Click the Start button to begin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterviewTips;