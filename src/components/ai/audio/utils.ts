/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Blob as GenAIBlob } from "@google/genai";

/**
 * Encodes a byte array into a Base64 string.
 */
export function encode(bytes: Uint8Array): string {
  // For Node.js environments or when Buffer is available
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  // For browser environments
  return btoa(String.fromCharCode.apply(null, Array.from(bytes)));
}

/**
 * Decodes a Base64 string into a byte array.
 */
export function decode(base64: string): Uint8Array {
  // For Node.js environments or when Buffer is available
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }
  // For browser environments
  const binaryString = atob(base64);
  return Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
}

/**
 * Creates a GenAI Blob object from Float32 audio data.
 * Converts Float32 audio data (-1 to 1) to Int16 PCM format.
 */
export function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // convert float32 -1 to 1 to int16 -32768 to 32767
    // Clamp the value to prevent overflow
    const clamped = Math.max(-1, Math.min(1, data[i]));
    int16[i] = Math.round(clamped * 32767);
  }

  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: "audio/pcm;rate=16000",
  };
}

/**
 * Decodes raw audio data into an AudioBuffer for playback.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> {
  // Create an AudioBuffer with the specified parameters.
  const buffer = ctx.createBuffer(
    numChannels,
    data.length / 2 / numChannels,
    sampleRate
  );

  // Convert raw Int16 data to Float32.
  const dataInt16 = new Int16Array(data.buffer);
  const l = dataInt16.length;
  const dataFloat32 = new Float32Array(l);
  for (let i = 0; i < l; i++) {
    dataFloat32[i] = dataInt16[i] / 32768.0;
  }

  // De-interleave and copy data to the correct channel in the AudioBuffer.
  if (numChannels === 1) {
    buffer.copyToChannel(dataFloat32, 0);
  } else {
    for (let i = 0; i < numChannels; i++) {
      const channel = dataFloat32.filter(
        (_, index) => index % numChannels === i
      );
      buffer.copyToChannel(channel, i);
    }
  }

  return buffer;
}

/**
 * Initializes audio contexts for input and output.
 */
export function initializeAudioContexts(): {
  inputContext: AudioContext;
  outputContext: AudioContext;
  inputNode: GainNode;
  outputNode: GainNode;
} {
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;

  const inputContext = new AudioContextClass({ sampleRate: 16000 });
  const outputContext = new AudioContextClass({ sampleRate: 24000 });

  const inputNode = inputContext.createGain();
  const outputNode = outputContext.createGain();

  outputNode.connect(outputContext.destination);

  return {
    inputContext,
    outputContext,
    inputNode,
    outputNode,
  };
}
