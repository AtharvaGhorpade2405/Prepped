function VoiceIndicator({mode,active}) {

  if (!active) {
        return (
          <div className="h-12 flex items-center justify-center text-gray-500">
            Evaluating…
          </div>
        );
      }

      const color =
        mode === "speaking"
          ? "bg-blue-400"
          : mode === "thinking"
          ? "bg-yellow-400"
          : "bg-green-400";

      return (
        <div className="flex items-center justify-center gap-2 h-12">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-2 rounded-full ${color} animate-voice`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      );
}
export default VoiceIndicator