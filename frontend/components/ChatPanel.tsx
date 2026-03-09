'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message { role: 'user' | 'model'; parts: { text: string }[]; }

interface ChatPanelProps {
  onExpenseAdded?: () => void;
  token?: string;
}

export default function ChatPanel({ onExpenseAdded, token }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'model',
    parts: [{ text: "👋 Hi! I'm your **AI Finance Copilot**. I can help you:\n\n- Track expenses: *\"I spent $12 on lunch\"*\n- Check spending: *\"How much did I spend this week?\"*\n- Manage budgets: *\"Am I over my food budget?\"*\n- Get insights: *\"How can I save more money?\"*\n\nWhat would you like to do?" }]
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !token) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userText }] }]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: userText, history: messages.slice(1) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.response || data.error || 'Error' }] }]);
      if (data.response?.includes('expense') || data.response?.includes('logged')) onExpenseAdded?.();
    } catch {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '⚠️ Network error, please try again.' }] }]);
    } finally {
      setLoading(false);
    }
  };

  // Voice input via Web Speech API
  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser'); return; }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    recognition.onend = () => setListening(false);
    if (!listening) { setListening(true); recognition.start(); } else { recognition.stop(); setListening(false); }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-200 border border-white/5 rounded-bl-none'
              }`}>
                <article className="prose prose-invert prose-sm max-w-none leading-relaxed">
                  <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                </article>
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <User size={16} className="text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none border border-white/5 bg-gray-800 px-5 py-4">
              {[0, 1, 2].map(i => (
                <span key={i} className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-4">
        <div className="flex gap-2">
          <button onClick={toggleVoice} className={`rounded-xl p-3 transition-colors ${listening ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask me anything about your finances..."
            disabled={loading}
            className="flex-1 rounded-xl border border-white/5 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-60"
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
