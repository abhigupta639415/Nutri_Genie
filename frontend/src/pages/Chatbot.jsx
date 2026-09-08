import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { PageContainer } from '../components/PageContainer';

const quickQuestions = [
  'Best vegetarian protein sources',
  'How to create a healthy calorie deficit?',
  'Quick 15-minute home workout',
  'Indian snacks under 150 calories',
  'How much water should I drink daily?',
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: "Namaste! I'm NutriBot, your AI nutritionist and fitness coach. 🤖\n\nI can help you with:\n• Indian meal swaps and macro counts\n• High-protein vegetarian & vegan sources\n• Workout routines & exercise form tips\n• Hydration & metabolic health\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/chatbot/chat', {
        message: userText,
      });

      const botMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        text: response.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: `err-${Date.now()}`,
        type: 'bot',
        text: 'Sorry, I encountered an issue connecting to the AI brain. Please try asking again in a moment.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <PageContainer maxWidth="max-w-5xl" className="py-10 sm:py-12 lg:py-16 space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              24/7 AI Health Companion
            </Badge>
            <span className="text-xs text-slate-400">• Gemini Pro Powered</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            NutriBot Assistant 🤖
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Instant guidance on Indian diet, macros, workout form, and healthy habits.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setMessages([
              {
                id: 'reset',
                type: 'bot',
                text: "Chat cleared! What health or nutrition question would you like to explore?",
                timestamp: new Date(),
              },
            ])
          }
          leftIcon={RefreshCw}
          className="text-xs self-start sm:self-auto"
        >
          Clear Chat
        </Button>
      </div>

      {/* Main Chat Container */}
      <Card className="overflow-hidden flex flex-col h-[700px] sm:h-[750px] border-slate-200/80 dark:border-white/10 shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 text-white rounded-br-sm shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`text-[10px] block mt-1.5 ${
                      msg.type === 'user'
                        ? 'text-cyan-100 text-right'
                        : 'text-slate-400 text-left'
                    }`}
                  >
                    {msg.timestamp?.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {msg.type === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-6 py-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Try:</span>
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleQuickQuestion(q)}
              className="shrink-0 px-2.5 py-1 text-xs rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask NutriBot about meals, recipes, macros, or workouts..."
            disabled={loading}
            className="flex-1 px-4 py-3 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputMessage.trim() || loading}
            isLoading={loading}
            rightIcon={Send}
            className="px-5 shadow-sm"
          >
            Send
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
};

export default Chatbot;
