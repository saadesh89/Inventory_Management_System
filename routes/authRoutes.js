const express = require('express');
const router = express.Router();
const { loginUser, registerOrCreateUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public route: Register a user or staff (Admin token required for staff)
router.post('/register', protect, registerOrCreateUser);

// Public route: Login
router.post('/login', loginUser);

module.exports = router;
