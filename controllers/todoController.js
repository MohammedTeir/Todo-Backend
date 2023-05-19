const Todo = require('../models/Todo');
const {todoValidator} = require('../validators');
const createError = require('http-errors');

// Function to create a new todo item
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, category } = req.body;
    const createdBy = req.user.id;

  
    // Validate input data against the schema
    const validation = todoValidator.createTodoSchema.validate({
      title,
      description,
      priority,
      dueDate,
      category,
    });
    if (validation.error) {
      const error = createError(400, validation.error.details[0].message.replace(/"/g, ''));
      return next(error);
    }

    const newTodo = new Todo({
      title,
      description,
      priority,
      dueDate,
      category,
      createdBy
    });

    const createdTodo = await newTodo.save();

     return res.status(201).json({
      status: 'success',
      message: 'Todo created successfully',
      data: createdTodo
    });

  } catch (error) {
    return next(error);
  }
};

// Function to get all todo items

const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ createdBy: req.user.id });
    if (todos.length==0) {
       const error = createError(404,'No todos found');
       return next(error);
    }
   return res.status(200).json({ message: 'Todos retrieved successfully', status: 'success' , data: todos });
  } catch (error) {
    return next(error);
  }
};


// Function to get a single todo item by ID
const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, createdBy: req.user.id });
    if (!todo) {
      const error = createError(404,'No todo found');
      return next(error);
    }
    return res.status(200).json({ status: 'success', data: todo });
  } catch (error) {
    return next(error);
  }
};

// Function to update a todo item by ID
const updateTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, category } = req.body;

    const validation = todoValidator.updateSchema.validate({
      title,
      description,
      priority,
      dueDate,
      category,
    });
    if (validation.error) {
      const error = createError(400, validation.error.details[0].message.replace(/"/g, ''));
      return next(error);
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      const error = createError(404,'No todo found');
      return next(error);
   }

    const update = {
      title: title || todo.title,
      description: description || todo.description,
      priority: priority || todo.priority,
      dueDate: dueDate || todo.dueDate,
      category: category || todo.category,
      updatedAt: Date.now()
    };

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      update,
      { new: true }
    );
    
    return res.status(200).json({  message: 'Todo updated successfully', status: 'success' , data: updatedTodo});
  } catch (error) {
    return next(error);
  }
};


// Function to delete a todo item by ID
const deleteTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!todo) {
      const error = createError(404,'No todo found');
      return next(error);
    }
    
    return res.status(200).json({ message: 'Todo deleted successfully', status: 'success' ,  data: todo });
  } catch (error) {
    return next(error);
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
      const error = createError(404,'No todo found');
      return next(error);
    }
    return res.status(200).json({ message: 'Todo marked as completed', status: 'success' , data: todo });
  } catch (error) {
    return next(error);
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
          const error = createError(404,'No todo found');
          return next(error);
        }
        return res.status(200).json({ message: 'Todo marked as incomplete', status: 'success' , data: todo});
      } catch (error) {
        return next(error);
      }
    };
    
    
    // Function to get all todo items by category
    const getTodosByCategory = async (req, res, next) => {
      try {
        const { category } = req.params;

        const validation = todoValidator.categoryTodosSchema.validate({ category });

        if (validation.error) {
          const error = createError(400, validation.error.details[0].message.replace(/"/g, ''));
          return next(error);
        }
    
        const todos = await Todo.find({ category, createdBy: req.user.id });
        if (todos.length === 0) {
          const error = createError(404,'No todos found in this category');
          return next(error);
        }
        return res.status(200).json({ message: 'Todos found in this category', status: 'success' , data: todos});
      } catch (error) {
        return next(error);
      }
    };
    

    // Get todos by priority
    const getTodosByPriority = async (req, res, next) => {
      try {

        
    
        // Validate input data against the schema
        const validation = todoValidator.priorityTodosSchema.validate({ priority: req.params.priority });
        if (validation.error) {
        const error = createError(400, validation.error.details[0].message.replace(/"/g, ''));
        return next(error);
        }

        const todos = await Todo.find({ createdBy: req.user.id, priority: req.params.priority }).sort({ createdAt: -1 });
        if (!todos.length) {
          const error = createError(404,'No todos found with this priority level');
          return next(error);
        }
        return res.status(200).json({ message: 'Todos fetched successfully', status: 'success', data: todos });
      } catch (error) {
        return next(error);
      }
    };
    

    // Function to delete all todo items for a user
    const deleteAllTodos = async (req, res, next) => {
      try {
        const deletedTodos = await Todo.deleteMany({ createdBy: req.user.id });

        if (deletedTodos.deletedCount === 0) {
           const error = createError(404,'No todos deleted');
           return next(error);
        }

        
        return res.status(200).json({
          status: 'success',
          message: 'All todos deleted successfully',
          data: {
            deleted: deletedTodos
          }
        });
      } catch (error) {
        return next(error);
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