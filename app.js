const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());





// Routes

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);



module.exports = app;
