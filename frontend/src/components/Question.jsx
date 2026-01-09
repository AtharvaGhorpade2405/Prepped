import { useInterview } from "../context/InterviewContext";

function Question() {

  const {
    currentQuestion
  }= useInterview()

  return (
    <>
      <h2 className="text-xs uppercase text-gray-400 mb-2">Question</h2>
      <p className="text-lg font-medium">{currentQuestion}</p>
    </>
  );
}
export default Question;
