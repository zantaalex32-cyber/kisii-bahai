import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  Calendar,
  Users,
  FileText,
  AlertCircle,
  ExternalLink,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import { UserProfile, AiChatMessage } from '../types';
import { askClusterAssistant } from '../lib/ai-assistant';
import { ROLE_LABELS } from '../lib/permissions';

interface AssistantChatProps {
  user: UserProfile;
  onNavigate: (path: string) => void;
}

export const AssistantChat: React.FC<AssistantChatProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello ${user.full_name.split(' ')[0]}! I am the **Kisii Cluster Assistant**. You can ask me questions about approved activities, devotional gatherings, study circles, resources, and announcements for Kisii Cluster.\n\nAll answers are grounded strictly in records authorized for your **${ROLE_LABELS[user.role].label}** role.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What activities are happening this weekend?',
    'Where is the next devotional meeting?',
    'What study circles are currently listed?',
    'What resources are available?',
    'What activities are happening in this locality?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    setInputQuery('');

    // Append user message
    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await askClusterAssistant(q, user);

      const assistantMsg: AiChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        modelUsed: response.model,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          content: "I couldn't find approved information about that in the cluster portal.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Assistant Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50/80 via-white to-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Kisii Cluster Assistant
            </h2>
            <p className="text-xs text-slate-500">
              Ask questions about approved cluster information.
            </p>
          </div>
        </div>

        {/* Security context tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-teal-200 text-teal-800 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Role Filter: {ROLE_LABELS[user.role].label}</span>
        </div>
      </div>

      {/* Suggested Questions Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
          Try:
        </span>
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-800 hover:bg-teal-50/50 transition shrink-0 whitespace-nowrap"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-teal-600 text-white shadow-2xs'
                }`}
              >
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none shadow-2xs'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-line font-normal">{msg.content}</div>

                {/* Grounded Source Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Approved Portal Sources:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (s.type === 'activity') onNavigate(`/activities/${s.id}`);
                            else if (s.type === 'group') onNavigate(`/groups/${s.id}`);
                            else if (s.type === 'document') onNavigate(`/documents/${s.id}`);
                            else onNavigate('/activities');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 transition"
                        >
                          {s.type === 'activity' && <Calendar className="w-3 h-3 text-teal-600" />}
                          {s.type === 'group' && <Users className="w-3 h-3 text-blue-600" />}
                          {s.type === 'document' && <FileText className="w-3 h-3 text-indigo-600" />}
                          <span className="truncate max-w-[150px]">{s.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 flex items-center justify-between ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && !isUser && (
                    <span className="text-[9px] font-mono text-slate-400">
                      Grounded: {msg.modelUsed}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Searching authorized cluster records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about Kisii Cluster activities, groups, documents, or schedules..."
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs shrink-0"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3 text-slate-400" />
          <span>The assistant strictly consults authorized records. Private records outside your role are never exposed.</span>
        </p>
      </div>
    </div>
  );
};
