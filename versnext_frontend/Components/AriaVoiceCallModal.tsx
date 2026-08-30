"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  MessageSquareText,
  Radio,
  Globe,
  Headphones,
} from "lucide-react";

interface VoiceMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
}

interface AriaVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://127.0.0.1:8000/api";
    }
    return "https://api.versenext.com/api";
  }
  return "https://api.versenext.com/api";
}

const quickCallStarters = [
  { label: "🤖 AI Calling Agent", text: "I need an AI voice calling agent for my business" },
  { label: "🏥 Clinic Receptionist", text: "Can you build an automated clinic appointment receptionist?" },
  { label: "💻 Web & SaaS Dev", text: "We need custom web development and automation" },
  { label: "📅 Book Discovery Call", text: "I want to schedule a 15-minute discovery call" },
];

export default function AriaVoiceCallModal({ isOpen, onClose }: AriaVoiceCallModalProps) {
  // Call States
  const [callState, setCallState] = useState<"connecting" | "active" | "ended">("connecting");
  const [agentStatus, setAgentStatus] = useState<"listening" | "thinking" | "speaking" | "muted">("speaking");
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState<boolean>(false);
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [callDuration, setCallDuration] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [showTranscript, setShowTranscript] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  // References
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const isAgentSpeakingRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  const isCallActiveRef = useRef<boolean>(false);

  // Format Duration
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Scroll transcript
  useEffect(() => {
    if (showTranscript) {
      transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showTranscript]);

  // Stop any playing audio or speech
  const stopAllAudio = useCallback(() => {
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch (e) {}
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    isAgentSpeakingRef.current = false;
  }, []);

  // Speech Synthesis fallback helper
  const speakText = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (isSpeakerMuted || !isCallActiveRef.current) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;

      // Select natural female voice
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(
        (v) =>
          v.name.includes("Natural") ||
          v.name.includes("Online (Natural)") ||
          v.name.includes("Google US English") ||
          v.name.includes("Aria") ||
          v.name.includes("Jenny") ||
          v.name.includes("Samantha") ||
          v.name.includes("Female")
      );

      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.pitch = 1.06;
      utterance.rate = 1.14;
      utterance.lang = language === "ur" ? "ur-PK" : "en-US";

      utterance.onstart = () => {
        isAgentSpeakingRef.current = true;
        setAgentStatus("speaking");
      };

      utterance.onend = () => {
        isAgentSpeakingRef.current = false;
        if (!isMicMuted && isCallActiveRef.current) {
          setAgentStatus("listening");
          startListening();
        } else {
          setAgentStatus("muted");
        }
      };

      utterance.onerror = () => {
        isAgentSpeakingRef.current = false;
        if (!isMicMuted && isCallActiveRef.current) setAgentStatus("listening");
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSpeakerMuted, isMicMuted, language]
  );

  // Play Real Studio Human Voice Audio
  const playAriaVoice = useCallback(
    (audioUrl?: string | null, fallbackText: string = "") => {
      if (isSpeakerMuted || !isCallActiveRef.current) return;
      stopAllAudio();

      if (audioUrl) {
        try {
          if (!audioPlayerRef.current) {
            audioPlayerRef.current = new Audio();
          }
          const player = audioPlayerRef.current;
          player.src = audioUrl;
          player.volume = 1.0;
          player.playbackRate = 1.15;

          player.onplay = () => {
            isAgentSpeakingRef.current = true;
            setAgentStatus("speaking");
          };

          player.onended = () => {
            isAgentSpeakingRef.current = false;
            if (!isMicMuted && isCallActiveRef.current) {
              setAgentStatus("listening");
              startListening();
            } else {
              setAgentStatus("muted");
            }
          };

          player.onerror = () => {
            console.warn("Audio player error, falling back to speech synthesis");
            speakText(fallbackText);
          };

          const playPromise = player.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn("Audio playback prevented:", err);
              speakText(fallbackText);
            });
          }
          return;
        } catch (e) {
          console.warn("Audio setup error:", e);
        }
      }

      speakText(fallbackText);
    },
    [isSpeakerMuted, isMicMuted, stopAllAudio, speakText]
  );

  // Send message to Backend
  const handleSendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isProcessingRef.current || !isCallActiveRef.current) return;

      isProcessingRef.current = true;
      stopAllAudio();

      // Stop recognition while processing
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      const userMsg: VoiceMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: userText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setTextInput("");
      setAgentStatus("thinking");

      try {
        const historyPayload = messages.slice(-6).map((m) => ({
          role: m.role,
          text: m.text,
        }));

        let responseReply = "";
        let audioUrl: string | null = null;
        let booked = false;

        const base = getApiBase();
        if (base) {
          const res = await fetch(`${base}/voice-agent/respond`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              message: userText.trim(),
              session_id: sessionId,
              history: historyPayload,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            responseReply = data?.data?.reply || "";
            audioUrl = data?.data?.audio_url || null;
            booked = !!data?.data?.booking_confirmed;
          }
        }

        if (!responseReply) {
          // Dynamic conversational fallback
          const isUrdu = language === "ur" || /(?:kya|kaise|mujhe|aap|chahiye|batao|meeting|waqt|urdu|baat|bolo)/i.test(userText);
          if (/(?:urdu|can you speak urdu|urdu me|urdu bolo)/i.test(userText)) {
            responseReply = "Ji bilkul! Main Urdu me baat kar sakti hoon. Aap batayein main aaj aapki kya madad kar sakti hoon?";
          } else if (/(?:service|services|kya karte|web|ai|calling|app|software)/i.test(userText)) {
            responseReply = isUrdu
              ? "Hum custom AI voice agents, web development, SaaS platforms aur business automation build karte hain. Aap ko kis service ki detail chahiye?"
              : "We build custom AI voice calling agents, full-stack websites, and business automations. Which solution would you like to explore?";
          } else if (/(?:meeting|schedule|book|call|demo)/i.test(userText)) {
            responseReply = isUrdu
              ? "Zaroor! Main aapki 15-minute discovery meeting arrange kar deti hoon. Aap ke liye kaunsa din aur time behtar rahega?"
              : "I would be happy to set up a 15-minute discovery call with our technical team. What day and time works best for you?";
          } else if (/(?:price|pricing|cost|kitne|kharcha)/i.test(userText)) {
            responseReply = isUrdu
              ? "Pricing project ke scope par depend karti hai. Hum call par aapko direct customized quote aur demo provide kar denge."
              : "Pricing depends on your project requirements. We provide a customized estimate on a quick discovery call.";
          } else {
            responseReply = isUrdu
              ? "Ji bilkul, main aapki poori madad kar sakti hoon. Aap apne project ke baare mein thoda aur batayein?"
              : "I'd love to help you with that! Could you tell me a little more about your requirements?";
          }
        }

        if (!isCallActiveRef.current) return;

        if (booked) {
          setBookingConfirmed(true);
        }

        const agentMsg: VoiceMessage = {
          id: `aria-${Date.now()}`,
          role: "assistant",
          text: responseReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, agentMsg]);
        playAriaVoice(audioUrl, responseReply);
      } catch (err) {
        if (!isCallActiveRef.current) return;
        console.error("Error communicating with Aria voice agent:", err);
        const isUrdu = language === "ur" || /(?:kya|kaise|mujhe|aap|chahiye|batao|meeting)/i.test(userText);
        const fallback = isUrdu
          ? "Ji main sun rahi hoon. Aap apne project ya meeting ke hawalay se kya janna chahte hain?"
          : "I am listening. Could you please let me know your project details or preferred meeting time?";
        const agentMsg: VoiceMessage = {
          id: `aria-${Date.now()}`,
          role: "assistant",
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, agentMsg]);
        playAriaVoice(null, fallback);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [sessionId, messages, language, stopAllAudio, playAriaVoice]
  );

  // Initialize Speech Recognition (STT)
  const startListening = useCallback(() => {
    if (isMicMuted || isAgentSpeakingRef.current || isProcessingRef.current || !isCallActiveRef.current) return;
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "ur" ? "ur-PK" : "en-US";

      recognition.onstart = () => {
        if (!isAgentSpeakingRef.current && isCallActiveRef.current) {
          setAgentStatus("listening");
        }
      };

      recognition.onresult = (event: any) => {
        if (!isCallActiveRef.current) return;
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          console.warn("Speech recognition error:", event.error);
        }
        if (!isAgentSpeakingRef.current && !isMicMuted && isCallActiveRef.current) {
          setAgentStatus("listening");
        }
      };

      recognition.onend = () => {
        if (!isCallActiveRef.current) return;
        if (!isAgentSpeakingRef.current && !isMicMuted && !isProcessingRef.current) {
          // Restart listening automatically after brief silence
          setTimeout(() => {
            if (isCallActiveRef.current && !isAgentSpeakingRef.current && !isMicMuted) {
              try {
                recognition.start();
              } catch (e) {}
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Recognition start failed:", e);
    }
  }, [isMicMuted, language, handleSendMessage]);

  // Start Call on Open
  useEffect(() => {
    if (!isOpen) {
      // Clean up when closed
      isCallActiveRef.current = false;
      stopAllAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
          recognitionRef.current = null;
        } catch (e) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setCallState("connecting");
      setCallDuration(0);
      setMessages([]);
      setBookingConfirmed(false);
      return;
    }

    isCallActiveRef.current = true;
    const sid = `aria-call-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setSessionId(sid);
    setCallState("connecting");

    // Pre-load synthesis voices
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }

    // Connect call
    const connectTimeout = setTimeout(async () => {
      if (!isCallActiveRef.current) return;
      setCallState("active");

      // Start timer
      timerRef.current = setInterval(() => {
        if (isCallActiveRef.current) {
          setCallDuration((prev) => prev + 1);
        }
      }, 1000);

      // Fetch or use initial greeting
      let greetingText =
        language === "ur"
          ? "Assalam-o-Alaikum! Verse Next me call karne ka shukriya. Main Aria hoon. Aaj aapki kis project me madad kar sakti hoon?"
          : "Hey there! Thanks for calling Verse Next. I'm Aria. How can I help you today?";
      let greetingAudioUrl: string | null = null;

      const base = getApiBase();
      if (base) {
        try {
          const res = await fetch(`${base}/voice-agent/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ session_id: sid, language }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.data?.greeting) greetingText = data.data.greeting;
            if (data?.data?.audio_url) greetingAudioUrl = data.data.audio_url;
          }
        } catch (e) {
          console.warn("Could not fetch remote greeting:", e);
        }
      }

      if (!isCallActiveRef.current) return;

      const initialMsg: VoiceMessage = {
        id: `aria-init`,
        role: "assistant",
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages([initialMsg]);
      playAriaVoice(greetingAudioUrl, greetingText);
    }, 800);

    return () => {
      clearTimeout(connectTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      stopAllAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
          recognitionRef.current = null;
        } catch (e) {}
      }
    };
  }, [isOpen, language, playAriaVoice, stopAllAudio]);

  // Toggle Mute Mic
  const toggleMuteMic = () => {
    if (isMicMuted) {
      setIsMicMuted(false);
      setAgentStatus("listening");
      startListening();
    } else {
      setIsMicMuted(true);
      setAgentStatus("muted");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  // Toggle Speaker
  const toggleSpeaker = () => {
    if (!isSpeakerMuted) {
      setIsSpeakerMuted(true);
      stopAllAudio();
    } else {
      setIsSpeakerMuted(false);
    }
  };

  // End Call Handler (Instant Clean Hangup)
  const handleEndCall = () => {
    isCallActiveRef.current = false;
    stopAllAudio();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
        recognitionRef.current = null;
      } catch (e) {}
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setCallState("ended");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-zinc-100 flex items-center gap-1.5">
                  Aria
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300">
                    Voice Agent
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">Verse Next AI Receptionist</p>
              </div>
            </div>

            {/* Language Selector & Call Timer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-zinc-800/70 border border-zinc-700/50 rounded-full px-2 py-1 text-xs text-zinc-300">
                <Globe className="w-3 h-3 text-cyan-400" />
                <button
                  onClick={() => setLanguage(language === "en" ? "ur" : "en")}
                  className="hover:text-cyan-300 transition-colors font-medium"
                >
                  {language === "en" ? "EN" : "Roman Urdu"}
                </button>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-mono font-medium text-cyan-400">
                {formatTime(callDuration)}
              </div>

              <button
                type="button"
                onClick={handleEndCall}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Close / End Call"
              >
                <PhoneOff className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>

          {/* Center Visualizer & Avatar Area */}
          <div className="relative z-10 flex flex-col items-center justify-center py-6 px-4">
            {/* Animated Waves Circle */}
            <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 my-2">
              {/* Outer Pulsing Waves */}
              {agentStatus === "speaking" && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-cyan-400/40 bg-cyan-500/10"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border border-blue-400/30"
                  />
                </>
              )}

              {agentStatus === "listening" && (
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/50 bg-emerald-500/10"
                />
              )}

              {/* Avatar Core */}
              <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent" />
                  <Headphones className="w-10 h-10 text-cyan-400 mb-1 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wider text-cyan-200">ARIA</span>
                </div>
              </div>
            </div>

            {/* Live Status Pill */}
            <div className="mt-2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 shadow-inner">
              {callState === "connecting" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-medium text-amber-300">Connecting Call...</span>
                </>
              )}
              {callState === "active" && agentStatus === "speaking" && (
                <>
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span className="text-xs font-medium text-cyan-300">Aria is speaking...</span>
                </>
              )}
              {callState === "active" && agentStatus === "thinking" && (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span className="text-xs font-medium text-blue-300">Aria is thinking...</span>
                </>
              )}
              {callState === "active" && agentStatus === "listening" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-medium text-emerald-300">Listening to you...</span>
                </>
              )}
              {callState === "active" && agentStatus === "muted" && (
                <>
                  <MicOff className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-400">Microphone Muted</span>
                </>
              )}
              {callState === "ended" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-medium text-rose-400">Call Ended</span>
                </>
              )}
            </div>

            {/* Booking Confirmed Badge */}
            {bookingConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Discovery Call Confirmed & Recorded!
              </motion.div>
            )}
          </div>

          {/* Quick Call Starter Chips */}
          <div className="relative z-10 px-4 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {quickCallStarters.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.text)}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/60 hover:bg-cyan-950/60 border border-zinc-700/60 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-200 transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Transcript Area */}
          <div className="relative z-10 flex-1 px-4 py-2 flex flex-col min-h-[140px] max-h-[220px]">
            <div className="flex items-center justify-between pb-1 px-1 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <MessageSquareText className="w-3.5 h-3.5 text-cyan-400" /> Live Spoken Transcript
              </span>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="hover:text-zinc-200 flex items-center gap-0.5 text-[11px]"
              >
                {showTranscript ? (
                  <>
                    Hide <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Show <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>

            {showTranscript && (
              <div className="flex-1 overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
                {messages.length === 0 ? (
                  <p className="text-zinc-500 italic text-center py-4">Connecting to Aria...</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-[10px] text-zinc-500 mb-0.5 px-1 font-mono">
                        {msg.role === "user" ? "You" : "Aria"} • {msg.timestamp}
                      </span>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                          msg.role === "user"
                            ? "bg-cyan-600 text-white rounded-br-none"
                            : "bg-zinc-800 text-zinc-200 border border-zinc-700/70 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={transcriptEndRef} />
              </div>
            )}
          </div>

          {/* Text input fallback */}
          <div className="relative z-10 px-4 pt-1 pb-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(textInput);
              }}
              className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 rounded-full px-3 py-1.5"
            >
              <input
                type="text"
                placeholder={
                  language === "ur"
                    ? "Yahan type karein agar mic band hai..."
                    : "Type a message if microphone is off..."
                }
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="p-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Bottom Action Controls */}
          <div className="relative z-10 flex items-center justify-around px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md">
            {/* Mic Toggle */}
            <button
              onClick={toggleMuteMic}
              title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
              className={`p-3.5 rounded-full border transition-all ${
                isMicMuted
                  ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                  : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
              }`}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              title="End Call"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-medium flex items-center gap-2 shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-sm font-semibold">End Call</span>
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={toggleSpeaker}
              title={isSpeakerMuted ? "Unmute Speaker" : "Mute Speaker"}
              className={`p-3.5 rounded-full border transition-all ${
                isSpeakerMuted
                  ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                  : "bg-blue-500/20 border-blue-500/40 text-blue-300 hover:bg-blue-500/30"
              }`}
            >
              {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
