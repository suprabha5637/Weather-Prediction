import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WeatherDataState } from '../../types/weather';
import {
  generateCopilotResponse,
  CopilotStructuredResponse,
} from '../../services/aiCopilotService';

interface AIWeatherCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherDataState;
}

export const AIWeatherCopilotModal: React.FC<AIWeatherCopilotModalProps> = ({
  isOpen,
  onClose,
  weather,
}) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<
    { sender: 'user' | 'bot'; text?: string; structured?: CopilotStructuredResponse }[]
  >([
    {
      sender: 'bot',
      structured: generateCopilotResponse('What should I do today?', weather),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'Will it rain tomorrow?',
    'Should I irrigate today?',
    'Can I spray pesticide tomorrow?',
    'Is this week good for sowing?',
    'When should I harvest?',
    'Will the heat affect my crop?',
  ];

  const handleSend = (textToSend?: string) => {
    const questionText = textToSend || query;
    if (!questionText.trim()) return;

    setConversation((prev) => [...prev, { sender: 'user', text: questionText }]);
    setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const response = generateCopilotResponse(questionText, weather);
      setConversation((prev) => [...prev, { sender: 'bot', structured: response }]);
      setIsThinking(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shadow-xs">
              <img
                src="/images/ai-robot.jpg"
                alt="AI Copilot"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  KrishiGo Weather Copilot
                </h2>
                <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Explainable AI
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-medium">
                Varanasi, UP • Grounded in 15-Day Local Forecast & Agronomy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 overflow-x-auto flex gap-1.5 shrink-0">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs font-semibold whitespace-nowrap bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3 py-1 rounded-full border border-slate-200 transition-all shadow-2xs shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Conversation Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/60">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'user' ? (
                <div className="bg-emerald-800 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%] text-xs sm:text-sm font-semibold shadow-xs">
                  {msg.text}
                </div>
              ) : (
                msg.structured && (
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 max-w-[92%] shadow-xs space-y-3">
                    {/* Primary Answer */}
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                          AI ADVISORY ANSWER
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {msg.structured.answer}
                        </p>
                      </div>
                    </div>

                    {/* Meteorological Reasoning (WHY) */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                        Why (Atmospheric Reason)
                      </span>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {msg.structured.why}
                      </p>
                    </div>

                    {/* Numerical Weather Evidence */}
                    <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1">
                        <Layers className="w-3 h-3 text-blue-500" />
                        Verified Weather Evidence
                      </span>
                      <p className="text-slate-700 font-mono text-[11px]">
                        {msg.structured.weatherData}
                      </p>
                    </div>

                    {/* Agronomic Impact & Action */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Recommended Action
                        </span>
                        <p className="text-slate-700 font-medium">
                          {msg.structured.recommendedAction}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Agronomic Risk
                        </span>
                        <p className="text-slate-700 font-medium">
                          {msg.structured.risk}
                        </p>
                      </div>
                    </div>

                    {/* Alternative & Calibrated Confidence */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>Alt: {msg.structured.alternative}</span>
                      <span className="font-bold text-emerald-700">
                        Confidence: {msg.structured.confidence}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Evaluating meteorological ensemble models...
            </div>
          )}
        </div>

        {/* Query Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about rain, heat, spraying, irrigation, sowing..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim()}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const AskAIFloatingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white pl-2.5 pr-4 py-2 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white/80 group"
      title="Ask AI Weather Copilot"
    >
      <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-xs overflow-hidden shrink-0">
        <img
          src="/images/ai-robot.jpg"
          alt="AI Robot"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <span className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
        Ask AI
      </span>
      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping -ml-1" />
    </button>
  );
};
