import { useInterview } from "../context/InterviewContext";

function Status() {

  const {
    status
  }= useInterview()

  return <p className="text-md text-gray-400 mb-4">{status}</p>;
}
export default Status;
