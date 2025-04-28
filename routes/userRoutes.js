const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const { getProfile, updateProfile, getAllUsers, getAllStaff } = require('../controllers/userController');

// Authenticated routes
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

// Admin-only
router.get('/admin/users', protect, allowRoles('admin'), getAllUsers);
router.get('/admin/staff', protect, allowRoles('admin'), getAllStaff);

module.exports = router;
