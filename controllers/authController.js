const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const {userValidator} = require('../validators');
const Todo = require('../models/Todo');
const dotenv = require('dotenv');
const revoked = require('../utils/revokeToken');
dotenv.config() // load environment variables from .env file
const createError = require('http-errors');

const secret = process.env.JWT_SECRET;
const saltRounds = process.env.SALT_ROUNDS;
const salt = bcryptjs.genSaltSync(parseInt(saltRounds));


// Function to register a new user
const register = async (req, res, next) => {
  try {
    const { name ,username, email, password } = req.body;


    const validation = userValidator.registerSchema.validate({ name, username, email, password });
    if (validation.error) {
      const error = createError(400, validation.error.details[0].message.replace(/"/g, ''));
      return next(error);
    }

    // Check if user with same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const error = createError(400, 'User already exists');
      return next(error);
    }

    // Hash password and create new user
    const hashedPassword = await bcryptjs.hash(password, salt);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Create JWT token
    const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    return res.status(201).json({
      status: 'success',
      message: 'User registered',
      _id: user._id,
      tokens: {
        accessToken
      }
    });
  } catch (error) {
    return next(error);
  }
};


// Function to login an existing user
const login = async (req, res, next) => {
  try {
    const { email, password , username } = req.body;

    

    const validation = userValidator.loginSchema.validate({ email, password, username });
    if (validation.error) {
      const error = createError(400, validation.error.details[0].message.replace(/"/g, ''));
      return next(error);
    }

    // Check if user with provided email exists
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      const error = createError(401, 'Invalid email, username, or password');
      return next(error);
    }

    // Check if provided password matches user's hashed password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {

      const error = createError(401, 'Invalid email or password');
      return next(error);

    }

    // Create JWT token
    const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      _id: user._id,
      tokens: {
        accessToken
      }
    });
  } catch (error) {
    return next(error);
  }
};


// Function to get currently logged in user
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(['-password','-_id']);
    if (!user) {
      const error = createError(404, 'User not found');
      return next(error);
    }
    return res.status(200).json({
      status: 'success',
      message: 'User data retrieved successfully',
      data: user
    });
  } catch (error) {
    return next(error);
  }
};


// Function to update currently logged in user
const updateProfile = async (req, res, next) => {
  try {
    const { username, name, age , gender , avatar , email, password } = req.body;

    const validation = userValidator.updateSchema.validate({
      username,
      name,
      age,
      gender,
      avatar,
      email,
      password,
    });
    if (validation.error) {
      const error = createError(400, validation.error.details[0].message.replace(/"/g, ''));
      return next(error);
    }

    // Check if user with same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }], _id: { $ne: req.user.id } });
    if (existingUser) {
      const error = createError(400, 'Username or Email already exists');
       return next(error);
    }

    

    // Update user with new details
    const user = await User.findById(req.user.id);
    const update = {
      username: username || user.username,
      email: email || user.email,
      name: name || user.name,
      age: age || user.age,
      gender: gender || user.gender,
      avatar: avatar || user.avatar
    };

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, salt);
      update.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, update, { new: true });

    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data:updatedUser
    });
  } catch (error) {
    return next(error);
  }
};


// Function to delete a user and all associated data
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Delete all todos created by the user
    await Todo.deleteMany({ createdBy: userId });

    // Delete the user
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      const error = createError(404, 'User not found');
      return next(error);
    }
    revokeToken(req.token);
    return res.status(200).json({ message: 'User deleted successfully', status: 'success' , _id: userId});
  } catch (error) {
    return next(error);
  }
};



  
  // Function to log out user
  const logout = async (req, res, next) => {
    try {


      res.clearCookie('token');

      revoked(req.token);

      return res.status(200).json({ message: 'Logout successful', status: 'success' });
      
    } catch (error) {
      return next(error);
    }
  };


module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  deleteUser,
  logout,

};
