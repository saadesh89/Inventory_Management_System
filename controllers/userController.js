const User = require('../models/User');

// Get current user's profile
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// Update profile
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Prevent role updates
    if (req.body.role && req.body.role !== user.role) {
      return res.status(403).json({ message: "You are not allowed to change your role." });
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.json(users);
};

// Admin: Get all staff
exports.getAllStaff = async (req, res) => {
  const staff = await User.find({ role: 'staff' }).select('-password');
  res.json(staff);
};
