const {Router} = require('express');
const router = Router();
const {todoController} = require('../controllers');
const auth = require('../middlewares/auth.middleware');

// Create a new todo item
router.post('/', auth,  todoController.createTodo);

// Get all todo items
router.get('/', auth,  todoController.getTodos);


// Get a single todo item by ID
router.get('/:id',  auth,  todoController.getTodoById);

// Update a todo item by ID
router.patch('/:id',  auth, todoController.updateTodoById);

// Delete a todo item by ID
router.delete('/:id', auth,  todoController.deleteTodoById);

// Mark a todo item as completed
router.patch('/:id/completed', auth,  todoController.markTodoAsCompleted);

// Mark a todo item as incomplete
router.patch('/:id/incomplete',auth,   todoController.markTodoAsIncomplete);

// Get all todo items by category
router.get('/category/:category',auth,   todoController.getTodosByCategory);

// Get all todo items by priority
router.get('/priority/:priority', auth,  todoController.getTodosByPriority);

module.exports = router;
