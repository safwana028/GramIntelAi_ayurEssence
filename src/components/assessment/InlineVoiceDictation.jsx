import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, AlertCircle, Volume2, Sparkles, Check, X } from "lucide-react";

/**
 * InlineVoiceDictation
 * A clinical speech-to-text dictation component designed to be placed directly beside
 * textarea inputs (clinical observations, question notes, patient messages, supervisor remarks).
 *
 * Capabilities:
 * - Uses Web Speech API (webkitSpeechRecognition) with en-IN clinical accent support
 * - Visual pulse animation and audio indicator when actively listening
 * - Shows interim speech recognition in real-time
 * - Doctor can choose to Append to existing content or Replace
 * - Clear microphone permission and browser support error handling
 * - Doctors can manually edit transcribed text at any time
 */
export function InlineVoiceDictation({
  value = "",
  onChange,
  fieldName = "Clinical Notes",
  className = ""
}) {
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [dictationError, setDictationError] = useState("");
  const [insertMode, setInsertMode] = useState("append"); // 'append' | 'replace'
  const recognitionRef = useRef(null);
  const latestValueRef = useRef(value);
  const insertModeRef = useRef(insertMode);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    insertModeRef.current = insertMode;
  }, [insertMode]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN"; // Indian English clinical terminology

      recognition.onstart = () => {
        setIsListening(true);
        setDictationError("");
        setInterimText("");
      };

      recognition.onresult = (event) => {
        let finalChunk = "";
        let interimChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript;
          } else {
            interimChunk += res[0].transcript;
          }
        }

        setInterimText(interimChunk);

        if (finalChunk.trim()) {
          applyTranscribedText(finalChunk.trim());
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setDictationError("Microphone permission denied. Please allow microphone access in your browser.");
        } else if (event.error === "no-speech") {
          // Normal timeout if doctor pauses speaking; keep listening or quiet
        } else {
          setDictationError(`Voice dictation error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
    } catch (err) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const applyTranscribedText = (text) => {
    if (!onChange || !text) return;

    if (insertModeRef.current === "append") {
      const existing = latestValueRef.current || "";
      const separator = existing.trim().length > 0 ? " " : "";
      const updated = existing + separator + text;
      latestValueRef.current = updated;
      onChange(updated);
    } else {
      latestValueRef.current = text;
      onChange(text);
    }
  };

  const toggleListening = () => {
    setDictationError("");
    if (!isSupported) {
      setDictationError("Speech recognition is not supported in this browser. Please type manually.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        setInterimText("");
        recognitionRef.current?.start();
      } catch (err) {
        console.warn("Recognition start failed, restarting instance:", err);
        try {
          recognitionRef.current?.abort();
          setTimeout(() => recognitionRef.current?.start(), 100);
        } catch (e) {
          setDictationError("Unable to activate microphone. Please verify permissions.");
        }
      }
    }
  };

  return (
    <div className={`inline-flex flex-col items-end gap-1.5 ${className}`}>
      <div className="flex items-center gap-1.5 bg-stone-100/90 border border-stone-200/90 px-2 py-1 rounded-xl shadow-2xs">
        {/* Append vs Replace Mode Toggle */}
        <div className="flex items-center bg-white rounded-lg p-0.5 border border-stone-200 text-[10px]">
          <button
            type="button"
            onClick={() => setInsertMode("append")}
            className={`px-1.5 py-0.5 rounded font-medium transition-all ${
              insertMode === "append"
                ? "bg-emerald-800 text-white font-bold"
                : "text-stone-500 hover:text-stone-800"
            }`}
            title="Append transcribed speech to existing text"
          >
            Append
          </button>
          <button
            type="button"
            onClick={() => setInsertMode("replace")}
            className={`px-1.5 py-0.5 rounded font-medium transition-all ${
              insertMode === "replace"
                ? "bg-emerald-800 text-white font-bold"
                : "text-stone-500 hover:text-stone-800"
            }`}
            title="Replace existing text with transcribed speech"
          >
            Replace
          </button>
        </div>

        {/* Dictation Trigger Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            isListening
              ? "bg-rose-600 text-white shadow-xs animate-pulse ring-2 ring-rose-400"
              : "bg-emerald-800 text-white hover:bg-emerald-700 shadow-2xs"
          }`}
          title={isListening ? "Click to stop dictation" : `Dictate ${fieldName} via microphone`}
          aria-label={isListening ? "Stop speech dictation" : "Start speech dictation"}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5 animate-bounce" />
              <span className="text-[11px] font-bold">Listening...</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span className="text-[11px]">Dictate</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Interim Speech Bubble */}
      {isListening && interimText && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-lg text-[11px] text-amber-900 animate-in fade-in max-w-xs shadow-xs">
          <Volume2 className="w-3 h-3 text-amber-600 shrink-0 animate-pulse" />
          <span className="italic truncate font-mono">"{interimText}"</span>
        </div>
      )}

      {/* Dictation Error Display */}
      {dictationError && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-300 rounded-lg text-[10px] text-rose-800 max-w-sm">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{dictationError}</span>
          <button
            type="button"
            onClick={() => setDictationError("")}
            className="ml-auto text-rose-500 hover:text-rose-800"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default InlineVoiceDictation;
