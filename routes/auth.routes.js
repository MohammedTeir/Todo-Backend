
const {Router} = require('express');
const {authController} = require('../controllers');
const router = Router();
const auth = require('../middlewares/auth.middleware');


// Route to register a new user
router.post('/register', authController.register);

// Route to log in an existing user
router.post('/login', authController.login);

// Route to get currently logged in user
router.get('/me', auth , authController.getMe);

// Route to update currently logged in user
router.put('/me',auth , authController.updateProfile);

// Route to delete currently logged in user and all associated data
router.delete('/me', auth , authController.deleteUser);

// Route to log out user
router.post('/logout', auth ,authController.logout);

module.exports = router;
