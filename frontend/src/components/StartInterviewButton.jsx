function StartInterviewButton({startInterview}) {
  return (
    <button
      onClick={startInterview}
      className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
    >
      Start Interview
    </button>
  );
}
export default StartInterviewButton;
