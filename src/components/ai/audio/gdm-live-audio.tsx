"use client";

import React from "react";
import { useGeminiLiveAudio } from "./hooks/use-gemini-live-audio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const GdmLiveAudio: React.FC = () => {
  return <></>;
  const {
    isRecording,
    status,
    error,
    startRecording,
    stopRecording,
    resetSession,
  } = useGeminiLiveAudio();

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card className="mx-auto">
        <CardContent className="space-y-6">
          {/* Status Display */}
          <div className="flex min-h-[60px] items-center justify-center overflow-hidden">
            {error ? (
              <p className="flex w-full flex-wrap overflow-hidden whitespace-break-spaces text-center">
                {error}
              </p>
            ) : (
              <p className="w-full break-words text-center font-mono text-[10px]">
                {isRecording && (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                )}
                {status}
              </p>
            )}
          </div>

          {/* Audio Visualizer */}
          <div className="flex justify-center">
            <div
              className={cn(
                "relative flex h-32 w-32 items-center justify-center rounded-full border-2 transition-all duration-300",
                isRecording
                  ? "border-primary bg-primary/10 scale-110"
                  : "border-muted bg-muted/10"
              )}
            >
              <div
                className={cn(
                  "h-16 w-16 rounded-full transition-all duration-300",
                  isRecording
                    ? "bg-primary animate-pulse"
                    : "bg-muted-foreground/20"
                )}
              />
              {isRecording && (
                <div className="border-primary absolute inset-0 animate-ping rounded-full border-2" />
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={resetSession}
              disabled={isRecording}
              className="h-12 w-12"
              title="Reset Session"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            {!isRecording ? (
              <Button
                size="lg"
                onClick={startRecording}
                className="h-16 w-16 rounded-full p-0"
                title="Start Recording"
              >
                <Mic className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="lg"
                onClick={stopRecording}
                className="h-16 w-16 rounded-full p-0"
                title="Stop Recording"
              >
                <MicOff className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-muted-foreground text-center text-sm">
            {!isRecording ? (
              <p>Click the microphone to start talking with the AI</p>
            ) : (
              <p>
                Speak clearly into your microphone. Click stop when finished.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GdmLiveAudio;
