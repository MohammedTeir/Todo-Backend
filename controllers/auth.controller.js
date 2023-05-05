const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Todo = require('../models/Todo');
const dotenv = require('dotenv');
const revoked = require('../utils/revokeToken');
dotenv.config() // load environment variables from .env file



const secret = process.env.JWT_SECRET;
const saltRounds = process.env.SALT_ROUNDS;
const salt = bcryptjs.genSaltSync(parseInt(saltRounds));


// Function to register a new user
const register = async (req, res, next) => {
  try {
    const { name ,username, email, password } = req.body;

    // Check if user with same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
       res.status(400).json({
        status: 'failed',
        message: 'User already exists'
      });
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
    res.status(201).json({
      status: 'success',
      message: 'User registered',
      _id: user._id,
      tokens: {
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};


// Function to login an existing user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user with provided email exists
    const user = await User.findOne({ email });
    if (!user) {
       res.status(401).json({
        status: 'failed',
        message: 'Invalid email or password'
      });
    }

    // Check if provided password matches user's hashed password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
       res.status(401).json({
        status: 'failed',
        message: 'Invalid email or password'
      });
    }

    // Create JWT token
    const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      _id: user._id,
      tokens: {
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};


// Function to get currently logged in user
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(['-password','-_id']);
    if (!user) {
       res.status(404).json({
        status: 'failed',
        message: 'User not found'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'User data retrieved successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};


// Function to update currently logged in user
const updateProfile = async (req, res, next) => {
  try {
    const { username, name, age , gender , avatar , email, password } = req.body;

    // Check if user with same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }], _id: { $ne: req.user.id } });
    if (existingUser) {
       res.status(400).json({
        status: 'failed',
        message: 'Username or Email already exists'
      });
    }

    // Update user with new details
    const user = await User.findById(req.user.id);
    user.username = username || user.username;
    user.email = email || user.email;
    user.name = name || user.name;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.avatar = avatar || user.avatar;

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      status: 'success',
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};


// Function to delete a user and all associated data
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let responseSent = false;

    // Delete all todos created by the user
    await Todo.deleteMany({ createdBy: userId });

    // Delete the user
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      res.status(404).json({ message: 'User not found', status: 'failed' });
      responseSent = true;
    }

    if (!responseSent) {
      res.status(200).json({ message: 'User and associated data deleted successfully', status: 'success' , _id: userId});
    }
  } catch (error) {
    next(error);
  }
};



  
  // Function to log out user
  const logout = async (req, res, next) => {
    try {
      // Clear JWT token from client-side


      res.clearCookie('token');

      revoked(req.token);

      res.status(200).json({ message: 'Logout successful', status: 'success' });
      
    } catch (error) {
      next(error);
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
