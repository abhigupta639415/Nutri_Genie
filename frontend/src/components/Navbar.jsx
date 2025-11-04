import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass-dark border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 shadow-xl shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-cyan-500/30">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                NutriGenie
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Link to="/dashboard" className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-semibold transition-colors duration-300 hover:bg-white/5 rounded-lg">
                  Dashboard
                </Link>
                <Link to="/diet" className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-semibold transition-colors duration-300 hover:bg-white/5 rounded-lg">
                  Diet
                </Link>
                <Link to="/workout" className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-semibold transition-colors duration-300 hover:bg-white/5 rounded-lg">
                  Workout
                </Link>
                <Link to="/progress" className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-semibold transition-colors duration-300 hover:bg-white/5 rounded-lg">
                  Progress
                </Link>
                <Link to="/todos" className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-semibold transition-colors duration-300 hover:bg-white/5 rounded-lg">
                  Tasks
                </Link>
                <Link to="/chatbot" className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-semibold transition-colors duration-300 hover:bg-white/5 rounded-lg">
                  NutriBot
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 font-semibold ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300 hover:bg-white/5 rounded-xl">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 font-bold">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-white/10 transition text-cyan-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-white/10 animate-fade-in">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-xl font-semibold transition-all">
                  Dashboard
                </Link>
                <Link to="/diet" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-xl font-semibold transition-all">
                  Diet Plan
                </Link>
                <Link to="/workout" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-xl font-semibold transition-all">
                  Workouts
                </Link>
                <Link to="/progress" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-xl font-semibold transition-all">
                  Progress
                </Link>
                <Link to="/todos" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-xl font-semibold transition-all">
                  My Tasks
                </Link>
                <Link to="/chatbot" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-xl font-semibold transition-all">
                  NutriBot
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg font-semibold transition-all mt-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-cyan-400 hover:bg-white/5 rounded-xl font-semibold transition-all">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg text-center font-bold transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
