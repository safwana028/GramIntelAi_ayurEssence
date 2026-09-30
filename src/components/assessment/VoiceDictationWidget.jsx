import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, RotateCcw, Check, AlertCircle, Play } from "lucide-react";

/**
 * Doctor Voice-to-Text Dictation Component
 * Features:
 * - Progressive enhancement using browser SpeechRecognition (webkitSpeechRecognition)
 * - Fallback message if browser lacks speech recognition support
 * - Visual "Listening..." pulse indicator
 * - Destination router:
 *    1. Clinical Observation (Free Text)
 *    2. Question-specific note
 *    3. Patient-facing message
 *    4. Doctor final report note
 * - Transcribed text is inserted into editable textareas for physician correction.
 */
export function VoiceDictationWidget({
  onInsertText,
  activeQuestionId = null,
  activeQuestionTitle = "",
  className = ""
}) {
  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [destination, setDestination] = useState("clinical"); // 'clinical' | 'question' | 'patient' | 'doctor'
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN"; // Prioritize Indian English clinical accent

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMessage("");
      };

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + " ";
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMessage("Microphone access was denied. Please allow microphone permissions.");
        } else if (event.error !== "no-speech") {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleStartRecording = () => {
    setErrorMessage("");
    if (!isSupported) {
      setErrorMessage("Voice transcription is not supported in this browser. Please type directly into the text fields.");
      return;
    }

    if (recognitionRef.current) {
      try {
        setTranscript("");
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition start failed, restarting:", err);
        try {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 200);
        } catch (retryErr) {
          setErrorMessage("Failed to initialize microphone. Please check browser permissions.");
        }
      }
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClear = () => {
    setTranscript("");
    setErrorMessage("");
  };

  const handleApply = () => {
    if (!transcript.trim()) return;
    onInsertText(transcript.trim(), destination, activeQuestionId);
    setTranscript("");
  };

  return (
    <div className={`bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isRecording ? "bg-rose-500 text-white animate-pulse" : "bg-emerald-800 text-amber-400"
          }`}>
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Doctor Voice-to-Text Dictation</h4>
            <p className="text-[11px] text-stone-500">
              Speak clinical observations hands-free. Real-time speech converted into editable text.
            </p>
          </div>
        </div>

        {/* Destination Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-stone-500 text-[11px] font-medium">Route to:</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-800 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="clinical">1. Clinical Observation</option>
            {activeQuestionId && (
              <option value="question">2. Question Note ({activeQuestionTitle || activeQuestionId})</option>
            )}
            <option value="patient">3. Patient-Facing Message</option>
            <option value="doctor">4. Doctor Final Report Note</option>
          </select>
        </div>
      </div>

      {/* Unsupported Browser Warning */}
      {!isSupported && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Voice transcription is not supported in this browser. You can type directly into the clinical text areas.</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Recording Box */}
      <div className="relative">
        <textarea
          rows={isRecording || transcript ? 3 : 2}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            isRecording
              ? "🎙 Listening... speak now (e.g. 'Patient reports erratic digestion and interrupted sleep')..."
              : "Click 'Start Recording' to dictate notes into the selected destination field..."
          }
          className={`w-full p-3 rounded-xl border text-xs leading-relaxed transition-all ${
            isRecording
              ? "border-rose-400 bg-rose-50/40 ring-2 ring-rose-400/20 text-stone-900"
              : "border-stone-300 bg-white text-stone-800"
          }`}
        />
        {isRecording && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold tracking-wider uppercase animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Listening...</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={handleStartRecording}
              disabled={!isSupported}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>🎙 Start Recording</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <MicOff className="w-3.5 h-3.5" />
              <span>⏹ Stop</span>
            </button>
          )}

          {transcript && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-200 text-xs font-medium flex items-center gap-1 transition-colors"
              title="Clear current transcription"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>⌫ Clear</span>
            </button>
          )}
        </div>

        {transcript && (
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5 text-stone-950" />
            <span>Insert into Field</span>
          </button>
        )}
      </div>
    </div>
  );
}
