function InterviewLoading() {
  return (
    <div className="flex items-center gap-3 text-blue-400">
      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      <span>Preparing interview…</span>
    </div>
  );
}
export default InterviewLoading;
