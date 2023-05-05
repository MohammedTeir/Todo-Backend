const Todo = require('../models/Todo');
const User = require('../models/User');

// Function to create a new todo item
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, category } = req.body;
    const createdBy = req.user.id;

    const newTodo = new Todo({
      title,
      description,
      priority,
      dueDate,
      category,
      createdBy
    });

    const createdTodo = await newTodo.save();

    // Add the new todo to the user's todo list
    // const user = await User.findById(createdBy);
    // user.todos.push(savedTodo._id);
    // await user.save();
      res.status(201).json({
      status: 'success',
      message: 'Todo created successfully',
      data: createdTodo
    });

  } catch (error) {
    next(error);
  }
};

// Function to get all todo items

const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ createdBy: req.user.id });
    if (todos.length==0) {
       res.status(404).json({ message: 'No todos found' });
    }
    res.status(200).json({ message: 'Todos retrieved successfully', status: 'success' , data: todos });
  } catch (error) {
    next(error);
  }
};


// Function to get a single todo item by ID
const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, createdBy: req.user.id });
    if (!todo) {
       res.status(404).json({  message: 'Todo not found' });
    }
    res.status(200).json({ status: 'success', data: todo });
  } catch (error) {
    next(error);
  }
};

// Function to update a todo item by ID
const updateTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, category } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { title, description, priority, dueDate, category, updatedAt: Date.now() },
      { new: true }
    );
    if (!todo) {
       res.status(404).json({ message: 'Todo not found', });
    }
    res.status(200).json({  message: 'Todo updated successfully', status: 'success' , data: todo._id});
  } catch (error) {
    next(error);
  }
};


// Function to delete a todo item by ID
const deleteTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!todo) {
       res.status(404).json({ message: 'Todo not found', status: 'failed' });
    }
    // Remove the todo from the user's todo list
    // const user = await User.findById(todo.createdBy);
    // user.todos = user.todos.filter((todoId) => todoId.toString() !== id);
    // await user.save();

    res.status(200).json({ message: 'Todo deleted successfully', status: 'success' ,  data: todo._id });
  } catch (error) {
    next(error);
  }
};



// Function to mark a todo item as completed
const markTodoAsCompleted = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { completed: true, updatedAt: Date.now() },
      { new: true }
    );
    if (!todo) {
       res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo marked as completed', status: 'success' , _id: todo._id });
  } catch (error) {
    next(error);
  }
};

    
    // Function to mark a todo item as incomplete
    const markTodoAsIncomplete = async (req, res, next) => {
      try {
        const { id } = req.params;
        const todo = await Todo.findOneAndUpdate(
          { _id: id, createdBy: req.user.id },
          { completed: false, updatedAt: Date.now() },
          { new: true }
        );
        if (!todo) {
           res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo marked as incomplete', status: 'success' , _id: todo._id});
      } catch (error) {
        next(error);
      }
    };
    
    
    // Function to get all todo items by category
    const getTodosByCategory = async (req, res, next) => {
      try {
        const { category } = req.params;
        const todos = await Todo.find({ category, createdBy: req.user.id });
        if (todos.length === 0) {
           res.status(404).json({ message: 'No todos found in this category'});
        }
        res.status(200).json({ message: 'Todos found in this category', status: 'success' , data: todos});
      } catch (error) {
        next(error);
      }
    };
    

    // Get todos by priority
    const getTodosByPriority = async (req, res, next) => {
      try {
        const todos = await Todo.find({ createdBy: req.user.id, priority: req.params.priority }).sort({ createdAt: -1 });
        if (!todos.length) {
           res.status(404).json({ message: 'No todos found with this priority level' });
        }
        res.status(200).json({ message: 'Todos fetched successfully', status: 'success', data: todos });
      } catch (error) {
        next(error);
      }
    };
    

    // Function to delete all todo items for a user
    const deleteAllTodos = async (req, res, next) => {
      try {
        const deletedTodos = await Todo.deleteMany({ createdBy: req.user.id });
        if (deletedTodos.deletedCount === 0) {
           res.status(404).json({ message: 'No todos deleted' });
        }
        // Remove all todos from the user's todo list
        // const user = await User.findById(req.user.id);
        // user.todos = [];
        // await user.save();
        
        res.status(200).json({
          status: 'success',
          message: 'All todos deleted successfully',
          data: {
            deleted: deletedTodos
          }
        });
      } catch (error) {
        next(error);
      }
    };
    
  

    module.exports = {
        createTodo,
        getTodos,
        getTodoById,
        updateTodoById,
        deleteTodoById,
        markTodoAsCompleted,
        markTodoAsIncomplete,
        getTodosByCategory,
        getTodosByPriority,
        deleteAllTodos,
        
      };