import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm NutriBot, your AI fitness assistant. 🤖\n\nI can help you with:\n✅ Diet and nutrition advice\n✅ Workout recommendations\n✅ Motivation and tips\n✅ Indian food suggestions\n✅ Fitness calculations\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/chatbot/chat', {
        message: inputMessage
      });

      const botMessage = {
        type: 'bot',
        text: response.data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'How can I lose weight?',
    'Best vegetarian protein sources',
    'Home workout routine',
    'Motivate me!',
    'How much water should I drink?'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
            Chat with NutriBot 🤖
          </h1>
          <p className="text-slate-300 text-lg">
            Your AI-powered fitness and nutrition assistant
          </p>
        </div>

        {/* Chat Container */}
        <div className="glass-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  } items-start space-x-2`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-cyan-500 to-purple-500 ml-2'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 mr-2'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="w-6 h-6 text-white" />
                    ) : (
                      <Bot className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-cyan-500/30'
                        : 'glass-dark border border-white/10 text-white shadow-purple-500/20'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === 'user'
                          ? 'text-cyan-100'
                          : 'text-slate-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="glass-dark border border-white/10 px-4 py-3 rounded-2xl shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-3 bg-slate-800/30 border-t border-white/10">
            <p className="text-sm text-slate-300 font-semibold mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-4 py-2 text-sm glass-dark border border-white/10 text-slate-300 rounded-full hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all transform hover:scale-105 font-semibold"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-6 bg-slate-800/30 border-t border-white/10">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-slate-500 font-semibold transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 font-bold"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 hover:shadow-cyan-500/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
              <div className="text-2xl">🍽️</div>
            </div>
            <h3 className="font-black text-white mb-2">Diet Advice</h3>
            <p className="text-sm text-slate-400">Ask about meal plans and nutrition</p>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 hover:shadow-purple-500/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
              <div className="text-2xl">💪</div>
            </div>
            <h3 className="font-black text-white mb-2">Workout Tips</h3>
            <p className="text-sm text-slate-400">Get exercise recommendations</p>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 hover:shadow-yellow-500/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
              <div className="text-2xl">🎯</div>
            </div>
            <h3 className="font-black text-white mb-2">Motivation</h3>
            <p className="text-sm text-slate-400">Stay inspired on your journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
