import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import DietPlan from './pages/DietPlan';
import Workout from './pages/Workout';
import Progress from './pages/Progress';
import Todos from './pages/Todos';
import Chatbot from './pages/Chatbot';
import FoodAnalyzer from './pages/FoodAnalyzer';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative selection:bg-cyan-500 selection:text-white overflow-x-hidden">
            {/* Global Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl" />
              <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            <Navbar />

            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/diet"
                  element={
                    <ProtectedRoute>
                      <DietPlan />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/workout"
                  element={
                    <ProtectedRoute>
                      <Workout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <Progress />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/todos"
                  element={
                    <ProtectedRoute>
                      <Todos />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/chatbot"
                  element={
                    <ProtectedRoute>
                      <Chatbot />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/food-analyzer"
                  element={
                    <ProtectedRoute>
                      <FoodAnalyzer />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
