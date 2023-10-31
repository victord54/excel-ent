const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

/**
 * Login route
 */
router.get('/login', authController.login);

/**
 * Signup route
 */
router.post('/signup', authController.signup);

module.exports = router;
