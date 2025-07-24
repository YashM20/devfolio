import GdmLiveAudio from "@/components/ai/audio/gdm-live-audio";

export default function SpeechTestPage() {
  return <> </>;
  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Live Audio Chat</h1>
        <p className="text-muted-foreground">
          Test the real-time speech-to-speech AI agent
        </p>
      </div>

      <div className="flex justify-center">
        <GdmLiveAudio />
      </div>

      <div className="text-muted-foreground mx-auto max-w-2xl space-y-2 text-sm">
        <h3 className="font-semibold">Setup Requirements:</h3>
        <ol className="list-inside list-decimal space-y-1">
          <li>Ensure GEMINI_API_KEY is set in your environment variables</li>
          <li>Grant microphone permissions when prompted</li>
          <li>Click "Connect" to establish the AI session</li>
          <li>Click "Start Listening" and speak your question</li>
          <li>The AI will respond with voice synthesis</li>
        </ol>
      </div>
    </div>
  );
}
