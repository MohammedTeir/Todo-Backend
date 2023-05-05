const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todo.routes');


const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Routes

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);



module.exports = app;
