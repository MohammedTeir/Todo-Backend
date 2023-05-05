const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config() // load environment variables from .env file
const { tokenBlocklist } = require('../tokenBlocklist');

module.exports  = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    req.token= token;

    if (token && tokenBlocklist.includes(token)) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    next();

  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  
  }
}


