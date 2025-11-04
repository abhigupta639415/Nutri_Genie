const Todo = require('../models/Todo');

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, recurring, recurringType, icon } = req.body;

    const todo = await Todo.create({
      userId: req.user._id,
      title,
      description,
      category,
      priority,
      dueDate,
      recurring,
      recurringType,
      icon
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all todos for user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const { completed, category } = req.query;
    
    const filter = { userId: req.user._id };
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    if (category) {
      filter.category = category;
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    
    res.json(todos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const allowedUpdates = ['title', 'description', 'category', 'priority', 'dueDate', 'recurring', 'recurringType', 'icon'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        todo[field] = req.body[field];
      }
    });

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date() : null;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
const getTodoStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [total, completed, byCategory] = await Promise.all([
      Todo.countDocuments({ userId }),
      Todo.countDocuments({ userId, completed: true }),
      Todo.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', count: { $sum: 1 }, completed: { $sum: { $cond: ['$completed', 1, 0] } } } }
      ])
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      pending: total - completed,
      completionRate,
      byCategory
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get today's todos
// @route   GET /api/todos/today
// @access  Private
const getTodayTodos = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todos = await Todo.find({
      userId: req.user._id,
      $or: [
        { dueDate: { $gte: today, $lt: tomorrow } },
        { recurring: true },
        { dueDate: null }
      ]
    }).sort({ priority: -1, createdAt: -1 });

    res.json(todos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getTodoStats,
  getTodayTodos
};
