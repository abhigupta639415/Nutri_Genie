import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Check, Trash2, Edit2, Calendar, Flag, Filter, TrendingUp, Target, Zap, X } from 'lucide-react';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCompleted, setFilterCompleted] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    dueDate: '',
    recurring: false,
    recurringType: 'daily',
    icon: '✓'
  });

  const categoryConfig = {
    workout: { name: 'Workout', icon: '💪', color: 'from-orange-500 to-red-500', emoji: '🏋️' },
    meal: { name: 'Meal', icon: '🍽️', color: 'from-green-500 to-teal-500', emoji: '🥗' },
    water: { name: 'Water', icon: '💧', color: 'from-blue-500 to-cyan-500', emoji: '💦' },
    sleep: { name: 'Sleep', icon: '😴', color: 'from-purple-500 to-indigo-500', emoji: '🛌' },
    habit: { name: 'Habit', icon: '⭐', color: 'from-yellow-500 to-orange-500', emoji: '✨' },
    other: { name: 'Other', icon: '📝', color: 'from-gray-500 to-gray-700', emoji: '📋' }
  };

  const priorityConfig = {
    low: { color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300', label: 'Low' },
    medium: { color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300', label: 'Medium' },
    high: { color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300', label: 'High' }
  };

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [filterCategory, filterCompleted]);

  const fetchTodos = async () => {
    try {
      let url = 'http://localhost:3001/api/todos?';
      if (filterCompleted !== 'all') {
        url += `completed=${filterCompleted === 'completed'}&`;
      }
      if (filterCategory !== 'all') {
        url += `category=${filterCategory}`;
      }
      
      const response = await axios.get(url);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/todos/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/todos', newTodo);
      setShowAddModal(false);
      resetForm();
      fetchTodos();
      fetchStats();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      await axios.patch(`http://localhost:3001/api/todos/${id}/toggle`);
      fetchTodos();
      fetchStats();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:3001/api/todos/${id}`);
        fetchTodos();
        fetchStats();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleEditTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/todos/${editingTodo._id}`, editingTodo);
      setEditingTodo(null);
      fetchTodos();
      fetchStats();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const resetForm = () => {
    setNewTodo({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      dueDate: '',
      recurring: false,
      recurringType: 'daily',
      icon: '✓'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-slate-300 text-lg font-semibold">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Animation */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
                My Fitness Tasks 📋
              </h1>
              <p className="text-slate-300 text-lg">
                Track your daily fitness activities and build healthy habits
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 font-bold"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Task</span>
            </button>
          </div>
        </div>

        {/* Stats Cards with Images */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-10 h-10" />
                <span className="text-3xl">🎯</span>
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-blue-100 text-sm">Total Tasks</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-2">
                <Check className="w-10 h-10" />
                <span className="text-3xl">✅</span>
              </div>
              <div className="text-3xl font-bold">{stats.completed}</div>
              <div className="text-green-100 text-sm">Completed</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-10 h-10" />
                <span className="text-3xl">⚡</span>
              </div>
              <div className="text-3xl font-bold">{stats.pending}</div>
              <div className="text-orange-100 text-sm">Pending</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-10 h-10" />
                <span className="text-3xl">📈</span>
              </div>
              <div className="text-3xl font-bold">{stats.completionRate}%</div>
              <div className="text-purple-100 text-sm">Success Rate</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.emoji} {config.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Check className="w-4 h-4 inline mr-1" />
                Status
              </label>
              <select
                value={filterCompleted}
                onChange={(e) => setFilterCompleted(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Todos List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg text-center animate-fade-in">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No tasks yet!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first fitness task
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Add Your First Task
              </button>
            </div>
          ) : (
            todos.map((todo, index) => (
              <div
                key={todo._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTodo(todo._id)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition transform hover:scale-110 ${
                        todo.completed
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-600'
                      }`}
                    >
                      {todo.completed && <Check className="w-5 h-5 text-white" />}
                    </button>

                    {/* Todo Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{categoryConfig[todo.category]?.emoji || '📋'}</span>
                          <div>
                            <h3 className={`text-lg font-bold ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingTodo(todo)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[todo.priority].color}`}>
                          <Flag className="w-3 h-3 inline mr-1" />
                          {priorityConfig[todo.priority].label}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {categoryConfig[todo.category]?.name || 'Other'}
                        </span>

                        {todo.dueDate && (
                          <span className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(todo.dueDate).toLocaleDateString('en-IN')}
                          </span>
                        )}

                        {todo.recurring && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                            🔄 {todo.recurringType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Todo Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Task</h2>
                  <button
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddTodo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTodo.title}
                      onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                      required
                      placeholder="e.g., Complete 30 minutes workout"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTodo.description}
                      onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                      placeholder="Add more details..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={newTodo.category}
                        onChange={(e) => setNewTodo({...newTodo, category: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <option key={key} value={key}>{config.emoji} {config.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority *
                      </label>
                      <select
                        value={newTodo.priority}
                        onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTodo.dueDate}
                      onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTodo.recurring}
                        onChange={(e) => setNewTodo({...newTodo, recurring: e.target.checked})}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Recurring Task</span>
                    </label>

                    {newTodo.recurring && (
                      <select
                        value={newTodo.recurringType}
                        onChange={(e) => setNewTodo({...newTodo, recurringType: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setShowAddModal(false); resetForm(); }}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Todo Modal */}
        {editingTodo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Task</h2>
                  <button
                    onClick={() => setEditingTodo(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleEditTodo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={editingTodo.title}
                      onChange={(e) => setEditingTodo({...editingTodo, title: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingTodo.description}
                      onChange={(e) => setEditingTodo({...editingTodo, description: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={editingTodo.category}
                        onChange={(e) => setEditingTodo({...editingTodo, category: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <option key={key} value={key}>{config.emoji} {config.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority *
                      </label>
                      <select
                        value={editingTodo.priority}
                        onChange={(e) => setEditingTodo({...editingTodo, priority: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingTodo(null)}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                    >
                      Update Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;
