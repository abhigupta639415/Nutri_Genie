const express = require('express');
const router = express.Router();
const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getTodoStats,
  getTodayTodos
} = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createTodo);
router.get('/', protect, getTodos);
router.get('/stats', protect, getTodoStats);
router.get('/today', protect, getTodayTodos);
router.get('/:id', protect, getTodo);
router.put('/:id', protect, updateTodo);
router.patch('/:id/toggle', protect, toggleTodo);
router.delete('/:id', protect, deleteTodo);

module.exports = router;
