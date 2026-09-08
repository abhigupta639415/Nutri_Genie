import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Check,
  Trash2,
  Edit2,
  Calendar,
  CheckSquare,
  Repeat,
} from 'lucide-react';
import { Button, Card, Badge, Modal, EmptyState, AnimatedCounter, Skeleton } from '../components/ui';
import { PageContainer } from '../components/PageContainer';

const categoryConfig = {
  workout: { name: 'Workout', icon: '💪', badge: 'brand', emoji: '🏋️' },
  meal: { name: 'Meal', icon: '🍽️', badge: 'accent', emoji: '🥗' },
  water: { name: 'Water', icon: '💧', badge: 'brand', emoji: '💦' },
  sleep: { name: 'Sleep', icon: '😴', badge: 'purple', emoji: '🛌' },
  habit: { name: 'Habit', icon: '⭐', badge: 'warning', emoji: '✨' },
  other: { name: 'Other', icon: '📝', badge: 'neutral', emoji: '📋' },
};

const priorityConfig = {
  low: { badge: 'accent', label: 'Low' },
  medium: { badge: 'warning', label: 'Medium' },
  high: { badge: 'danger', label: 'High' },
};

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
    icon: '✓',
  });

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [filterCategory, filterCompleted]);

  const fetchTodos = async () => {
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/todos?`;
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/todos/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/todos`, newTodo);
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
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/todos/${id}/toggle`);
      fetchTodos();
      fetchStats();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/todos/${id}`);
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
      await axios.put(`${process.env.REACT_APP_API_URL}/api/todos/${editingTodo._id}`, editingTodo);
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
      icon: '✓',
    });
  };

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16 space-y-10 sm:space-y-12">
      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="brand" size="sm">
              Habits & Disciplines
            </Badge>
            <span className="text-xs text-slate-400">• Daily Accountability</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Daily Fitness Tasks ✅
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5">
            Manage hydration, meal logging, workout splits, and recovery routines.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
          leftIcon={Plus}
          className="self-start sm:self-auto shadow-md shadow-cyan-500/25"
        >
          Add New Task
        </Button>
      </div>

      {/* ─── STATS SUMMARY CARDS ───────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <Card className="p-6 sm:p-7 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Total Tasks</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={stats.total || 0} />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">All active items</p>
          </Card>

          <Card className="p-6 sm:p-7 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Completed</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              <AnimatedCounter value={stats.completed || 0} />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Successfully marked</p>
          </Card>

          <Card className="p-6 sm:p-7 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Pending</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              <AnimatedCounter value={stats.pending || 0} />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">To do today</p>
          </Card>

          <Card className="p-6 sm:p-7 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Completion Rate</span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">
              <AnimatedCounter
                value={stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}
                suffix="%"
              />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Habit score</p>
          </Card>
        </div>
      )}

      {/* ─── CATEGORY & STATUS FILTERS ─────────────────────────────────── */}
      <Card className="p-5 sm:p-6 space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              filterCategory === 'all'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            All Categories
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterCategory(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                filterCategory === key
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span>{config.emoji}</span>
              <span>{config.name}</span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-white/10 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Status:</span>
          {['all', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterCompleted(status)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors ${
                filterCompleted === status
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* ─── TASK LIST ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No Tasks Found"
          description={
            filterCategory !== 'all' || filterCompleted !== 'all'
              ? 'No tasks match your active filters. Try clearing filters or creating a new task.'
              : 'You have no daily tasks yet. Stay disciplined by adding hydration, workout, or nutrition habits.'
          }
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowAddModal(true)}
              leftIcon={Plus}
            >
              Add Your First Task
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {todos.map((todo) => {
              const cat = categoryConfig[todo.category] || categoryConfig.other;
              const prio = priorityConfig[todo.priority] || priorityConfig.medium;

              return (
                <motion.div
                  key={todo._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`p-5 sm:p-6 flex items-center justify-between gap-4 border transition-all ${
                      todo.completed
                        ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-white/5 opacity-70'
                        : 'hover:border-cyan-500/40 shadow-sm'
                    }`}
                  >
                    {/* Checkbox and Title */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleToggleTodo(todo._id)}
                        aria-label={todo.completed ? 'Mark pending' : 'Mark completed'}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                          todo.completed
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-slate-300 dark:border-white/20 hover:border-cyan-500 bg-white dark:bg-slate-800 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </motion.button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`text-sm sm:text-base font-bold leading-tight ${
                              todo.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {todo.title}
                          </span>
                          <Badge variant={cat.badge} size="sm">
                            {cat.emoji} {cat.name}
                          </Badge>
                          <Badge variant={prio.badge} size="sm">
                            {prio.label}
                          </Badge>
                          {todo.recurring && (
                            <Badge variant="neutral" size="sm" icon={Repeat}>
                              {todo.recurringType}
                            </Badge>
                          )}
                        </div>

                        {todo.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {todo.description}
                          </p>
                        )}

                        {todo.dueDate && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Due {new Date(todo.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingTodo(todo)}
                        aria-label="Edit task"
                        className="p-2 rounded-xl text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTodo(todo._id)}
                        aria-label="Delete task"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ─── ADD TASK MODAL ────────────────────────────────────────────── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Create New Fitness Task"
        description="Add a meal prep, workout routine, or healthy habit to track."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddTodo} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              required
              placeholder="e.g. Drink 3 Liters of Water"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              rows={2}
              placeholder="Add details, target weights, or meal prep notes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={newTodo.category}
                onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.emoji} {config.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority *
              </label>
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={newTodo.dueDate}
              onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={newTodo.recurring}
                onChange={(e) => setNewTodo({ ...newTodo, recurring: e.target.checked })}
                className="rounded text-cyan-500 focus:ring-cyan-400"
              />
              <span>Recurring Daily / Weekly</span>
            </label>

            {newTodo.recurring && (
              <select
                value={newTodo.recurringType}
                onChange={(e) => setNewTodo({ ...newTodo, recurringType: e.target.value })}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" leftIcon={Plus}>
              Add Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── EDIT TASK MODAL ───────────────────────────────────────────── */}
      {editingTodo && (
        <Modal
          isOpen={Boolean(editingTodo)}
          onClose={() => setEditingTodo(null)}
          title="Edit Task"
          description="Update your task details or target date."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleEditTodo} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={editingTodo.title}
                onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={editingTodo.description}
                onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={editingTodo.category}
                  onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.emoji} {config.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Priority *
                </label>
                <select
                  value={editingTodo.priority}
                  onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setEditingTodo(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Update Task
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Todos;
