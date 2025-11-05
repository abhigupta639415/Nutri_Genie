import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, TrendingUp, Brain, Award, Users, CheckCircle, ChevronDown, Sparkles, Zap, Target, Dumbbell, Apple, Activity } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: 'AI-Powered Plans',
      description: 'Get personalized diet and workout plans based on your goals, body metrics, and preferences',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <Apple className="w-12 h-12" />,
      title: 'Indian Cuisine Focus',
      description: 'Authentic Indian meal plans with nutritional breakdowns for local dishes you love',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Progress Tracking',
      description: 'Visual charts and analytics to track calories, weight, workouts, and overall progress',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Dumbbell className="w-12 h-12" />,
      title: 'Custom Workouts',
      description: 'Home or gym workouts including Yoga, HIIT, Cardio, and Strength training',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'NutriBot Assistant',
      description: 'Chat with our AI bot for instant answers to diet, fitness, and nutrition queries',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: 'Goal Achievement',
      description: 'Whether it\'s weight loss, gain, or maintenance - we\'ve got you covered',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Lost 15kg', text: 'NutriGenie changed my life! The AI-powered meal plans fit perfectly with my Indian diet preferences.' },
    { name: 'Rahul Verma', role: 'Gained Muscle', text: 'The workout plans are fantastic! I gained 8kg of muscle in just 4 months.' },
    { name: 'Anjali Patel', role: 'Healthier Lifestyle', text: 'Finally, a fitness app that understands Indian cuisine and lifestyle. Highly recommended!' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left z-10 space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-semibold mb-4 shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>AI-Powered Fitness Revolution</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight">
                Transform
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-3 animate-gradient-x">
                  Your Body
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                Get AI-powered diet plans, custom workouts, and real-time guidance tailored for Indian lifestyle and authentic cuisine
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="group px-10 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-10 py-5 bg-slate-800/50 backdrop-blur-sm text-cyan-400 text-lg font-bold rounded-2xl border-2 border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                >
                  Login
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-12">
                {[
                  { value: '10K+', label: 'Active Users' },
                  { value: '50K+', label: 'Meal Plans' },
                  { value: '95%', label: 'Success Rate' }
                ].map((stat, index) => (
                  <div key={index} className="text-center lg:text-left backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-sm text-slate-400 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero Image with Real Fitness Photo */}
            <div className="relative lg:h-[600px] animate-fade-in animation-delay-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl transform rotate-6 opacity-20 blur-2xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-purple-900/50">
                <img 
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop" 
                  alt="Fitness transformation" 
                  className="w-full h-[600px] object-cover opacity-80 hover:opacity-90 transition-opacity duration-500"
                />
                
                {/* Overlay Stats Card */}
                <div className="absolute bottom-8 left-8 right-8 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 animate-slide-up">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">Today's Progress</div>
                      <div className="text-sm text-cyan-400">You're doing great! 💪</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {[
                      { label: 'Calories', value: '1,850', max: '2,000', percent: 92 },
                      { label: 'Workout', value: '45', max: '60 min', percent: 75 },
                      { label: 'Water', value: '6', max: '8 glasses', percent: 75 }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="text-cyan-400 font-semibold">{item.value}/{item.max}</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-16 animate-bounce">
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="section-features" className={`py-24 relative transition-all duration-1000 ${isVisible['section-features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">NutriGenie?</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to achieve your fitness goals, powered by cutting-edge AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-500/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    {React.cloneElement(feature.icon, { className: 'w-full h-full text-white' })}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Showcase Section with Images */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-5xl font-black text-white leading-tight">
                Track Every
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Milestone
                </span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Monitor your progress with beautiful visualizations, detailed analytics, and AI-powered insights that keep you motivated every step of the way.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <TrendingUp className="w-6 h-6" />, text: 'Real-time progress tracking' },
                  { icon: <Brain className="w-6 h-6" />, text: 'AI-powered recommendations' },
                  { icon: <Award className="w-6 h-6" />, text: 'Achievement badges & rewards' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-300 hover:text-cyan-400 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-lg font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in animation-delay-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl transform -rotate-6 opacity-20 blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop" 
                alt="Gym workout" 
                className="relative rounded-3xl shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="section-how" className={`py-24 relative transition-all duration-1000 ${isVisible['section-how'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-center text-white mb-20">
            Get Started in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">4 Simple Steps</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-30"></div>
            
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your account in seconds', icon: <Users className="w-6 h-6" />, color: 'from-cyan-500 to-blue-500' },
              { step: '2', title: 'Set Profile', desc: 'Tell us about your goals', icon: <Target className="w-6 h-6" />, color: 'from-purple-500 to-pink-500' },
              { step: '3', title: 'Get AI Plan', desc: 'Receive personalized plans', icon: <Brain className="w-6 h-6" />, color: 'from-pink-500 to-orange-500' },
              { step: '4', title: 'Track Progress', desc: 'Monitor your journey', icon: <TrendingUp className="w-6 h-6" />, color: 'from-orange-500 to-yellow-500' }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in relative z-10" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative mx-auto mb-6">
                  <div className={`w-24 h-24 bg-gradient-to-br ${item.color} text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300`}>
                    {item.step}
                  </div>
                  <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-xl border-4 border-slate-900`}>
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Section with Image */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-fade-in order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl transform rotate-6 opacity-20 blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop" 
                alt="Healthy Indian food" 
                className="relative rounded-3xl shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-8 animate-fade-in order-1 lg:order-2">
              <h2 className="text-5xl font-black text-white leading-tight">
                Nutrition Made
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  Delicious
                </span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Enjoy authentic Indian meals while hitting your fitness goals. Our AI understands your cuisine preferences and creates meal plans you'll actually love.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { emoji: '🍛', label: 'Indian Cuisine', value: '1000+' },
                  { emoji: '🥗', label: 'Healthy Recipes', value: '500+' },
                  { emoji: '🔥', label: 'Calories Tracked', value: '10M+' },
                  { emoji: '⭐', label: 'User Rating', value: '4.9/5' }
                ].map((item, i) => (
                  <div key={i} className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:bg-white/10">
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="text-2xl font-bold text-white">{item.value}</div>
                    <div className="text-sm text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="section-testimonials" className={`py-24 relative transition-all duration-1000 ${isVisible['section-testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-center text-white mb-20">
            Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Stories</span>
          </h2>

          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 md:p-16 shadow-2xl border border-white/10">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${index === activeTestimonial ? 'opacity-100 block' : 'opacity-0 hidden'}`}
              >
                <div className="text-cyan-400 text-7xl mb-6 leading-none">"</div>
                <p className="text-2xl text-slate-300 mb-8 italic leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xl">{testimonial.name}</div>
                    <div className="text-cyan-400 text-lg font-semibold">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-cyan-500 w-12 shadow-lg shadow-cyan-500/50' : 'bg-slate-600 w-3 hover:bg-slate-500'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=600&fit=crop" 
          alt="Fitness motivation" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Ready to Transform Your Lifestyle?
          </h2>
          <p className="text-2xl text-white/90 mb-12 leading-relaxed">
            Join thousands of users achieving their fitness goals with NutriGenie
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="group px-12 py-6 bg-white text-purple-600 text-xl font-black rounded-2xl hover:bg-slate-100 transition-all duration-300 shadow-2xl transform hover:scale-110 inline-flex items-center gap-3"
          >
            Get Started Free
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>
          <p className="text-white/80 mt-6 text-lg">No credit card required • 7-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">NutriGenie</span>
            </div>
            <p className="text-slate-400 mb-3 text-lg">
              © 2024 NutriGenie. Your AI-Powered Fitness Companion
            </p>
            <p className="text-slate-500">
              Made with ❤️ for a healthier India
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.2);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out 0.5s forwards;
          opacity: 0;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;