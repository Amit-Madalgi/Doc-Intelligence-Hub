const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');

// Route for user registration
router.post('/register', registerUser);

// Route for user login/authentication
router.post('/login', authUser);

module.exports = router;