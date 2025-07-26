"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Session,
} from "@google/genai";
import {
  createBlob,
  decode,
  decodeAudioData,
  initializeAudioContexts,
} from "../utils";

interface UseGeminiLiveAudioReturn {
  isRecording: boolean;
  status: string;
  error: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetSession: () => void;
}

export function useGeminiLiveAudio(): UseGeminiLiveAudioReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Click Start to begin conversation.");
  const [error, setError] = useState("");

  // Refs for API client, session, and audio processing nodes
  const clientRef = useRef<GoogleGenAI | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<GainNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  const handleError = useCallback((message: string, err?: unknown) => {
    console.error(message, err);
    setError(message);
    setStatus("");
  }, []);

  const initAudio = useCallback(() => {
    try {
      const { inputContext, outputContext, inputNode, outputNode } =
        initializeAudioContexts();

      inputAudioContextRef.current = inputContext;
      outputAudioContextRef.current = outputContext;
      inputNodeRef.current = inputNode;
      outputNodeRef.current = outputNode;

      nextStartTimeRef.current = outputContext.currentTime;
    } catch (err) {
      handleError("Failed to initialize audio context.", err);
    }
  }, [handleError]);

  const initSession = useCallback(async () => {
    setError("");
    if (
      !clientRef.current ||
      !outputAudioContextRef.current ||
      !outputNodeRef.current
    ) {
      handleError("Client or audio context not initialized.");
      return;
    }

    // This model is specific to the user's real-time audio use case.
    const model = "gemini-2.5-flash-preview-native-audio-dialog";

    try {
      setStatus("Connecting to Gemini...");
      const session = await clientRef.current.live.connect({
        model: model,
        callbacks: {
          onopen: () => {
            console.log("Session opened");
            setStatus("Connection open. Click Start to talk.");
          },
          onmessage: async (message: LiveServerMessage) => {
            const audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData;

            if (
              audio &&
              outputAudioContextRef.current &&
              outputNodeRef.current
            ) {
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outputAudioContextRef.current.currentTime
              );

              try {
                const audioBuffer = await decodeAudioData(
                  decode(audio.data || ""),
                  outputAudioContextRef.current,
                  24000,
                  1 // Mono audio output
                );
                const source =
                  outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNodeRef.current);
                source.addEventListener("ended", () => {
                  sourcesRef.current.delete(source);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              } catch (err) {
                handleError("Failed to process audio response.", err);
              }
            }

            if (message.serverContent?.interrupted) {
              console.log("Playback interrupted by user speech.");
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: Event) => {
            handleError(
              `Session error: ${(e as ErrorEvent).message || "Unknown error"}`
            );
          },
          onclose: (e: CloseEvent) => {
            console.log("Session closed:", e.reason);
            setStatus("Session closed. " + e.reason);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Orus" } },
          },
        },
      });

      sessionRef.current = session;
    } catch (e) {
      handleError(
        `Failed to initialize session: ${e instanceof Error ? e.message : "Unknown error"}`,
        e
      );
    }
  }, [handleError]);

  const initClient = useCallback(async () => {
    initAudio();
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY environment variable is missing");
      }
      clientRef.current = new GoogleGenAI({ apiKey });
      await initSession();
    } catch (err) {
      handleError(
        `Failed to initialize Gemini client: ${err instanceof Error ? err.message : "Unknown error"}`,
        err
      );
    }
  }, [initAudio, initSession, handleError]);

  const startRecording = useCallback(async () => {
    if (
      isRecording ||
      !inputAudioContextRef.current ||
      !inputNodeRef.current ||
      !sessionRef.current
    ) {
      return;
    }
    setError("");
    await inputAudioContextRef.current.resume();
    setStatus("Requesting microphone access...");

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      mediaStreamRef.current = mediaStream;

      const sourceNode =
        inputAudioContextRef.current.createMediaStreamSource(mediaStream);
      sourceNodeRef.current = sourceNode;
      sourceNode.connect(inputNodeRef.current);

      const bufferSize = 4096;
      const scriptProcessorNode =
        inputAudioContextRef.current.createScriptProcessor(bufferSize, 1, 1);
      scriptProcessorNodeRef.current = scriptProcessorNode;

      scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
        try {
          if (!sessionRef.current) return;
          const inputBuffer = audioProcessingEvent.inputBuffer;
          const pcmData = inputBuffer.getChannelData(0);
          sessionRef.current.sendRealtimeInput({ media: createBlob(pcmData) });
        } catch (error) {
          console.error("Error processing audio:", error);
          handleError("Failed to process audio input", error);
        }
      };

      sourceNode.connect(scriptProcessorNode);
      scriptProcessorNode.connect(inputAudioContextRef.current.destination); // Mute output

      setIsRecording(true);
      setStatus("🔴 Listening... Speak now.");
    } catch (err) {
      handleError(
        `Error starting recording: ${err instanceof Error ? err.message : "Unknown error"}`,
        err
      );
      stopRecording();
    }
  }, [isRecording, handleError]);

  const stopRecording = useCallback(() => {
    if (!mediaStreamRef.current && !inputAudioContextRef.current) {
      return;
    }
    setStatus("Stopping recording...");
    setIsRecording(false);

    if (
      scriptProcessorNodeRef.current &&
      sourceNodeRef.current &&
      inputAudioContextRef.current
    ) {
      scriptProcessorNodeRef.current.disconnect();
      sourceNodeRef.current.disconnect();
    }
    scriptProcessorNodeRef.current = null;
    sourceNodeRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setStatus("Recording stopped. Click Start to talk again.");
  }, []);

  const resetSession = useCallback(() => {
    setStatus("Resetting session...");
    sessionRef.current?.close();
    initSession();
  }, [initSession]);

  // Initialize client on mount
  useEffect(() => {
    initClient();

    return () => {
      // Full cleanup on component unmount
      stopRecording();
      sessionRef.current?.close();
      for (const source of sourcesRef.current.values()) {
        source.stop();
      }
      sourcesRef.current.clear();
      inputAudioContextRef.current?.close().catch(console.error);
      outputAudioContextRef.current?.close().catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  return {
    isRecording,
    status,
    error,
    startRecording,
    stopRecording,
    resetSession,
  };
}
