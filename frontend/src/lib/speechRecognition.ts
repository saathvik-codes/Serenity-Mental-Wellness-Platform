type SpeechRecognitionConstructor = new () => any;

const speechErrorMessages: Record<string, string> = {
  "aborted": "Voice input was stopped before a result was captured.",
  "audio-capture": "No working microphone was detected. Check your microphone settings and try again.",
  "network": "Voice recognition could not reach the browser speech service. Try again in a moment.",
  "no-speech": "No speech was detected. Speak a little closer to the microphone and try again.",
  "not-allowed": "Microphone access is blocked. Allow microphone permission in the browser and try again.",
  "service-not-allowed": "This browser does not currently allow speech recognition for this page.",
  "language-not-supported": "The selected speech language is not supported in this browser.",
  "bad-grammar": "The browser could not process that voice input. Try again with a shorter phrase.",
};

export const getSpeechRecognitionConstructor = (): SpeechRecognitionConstructor | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export const isSpeechRecognitionSupported = () => Boolean(getSpeechRecognitionConstructor());

export const getSpeechRecognitionErrorMessage = (errorCode?: string) =>
  speechErrorMessages[errorCode || ""] || "Voice input is unavailable right now. Please try again.";

export const isIgnorableSpeechError = (errorCode?: string) => errorCode === "aborted";
