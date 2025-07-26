/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Blob as GenAIBlob } from "@google/genai";

/**
 * Encodes a byte array into a Base64 string.
 */
export function encode(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string into a byte array.
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
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
    int16[i] = data[i] * 32768;
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