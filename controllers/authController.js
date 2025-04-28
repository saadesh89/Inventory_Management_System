const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('./mail');


const createUser = async ({ name, email, password, role = 'user' }, requesterRole) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('Email already in use');

  if (role === 'staff' && requesterRole !== 'admin') {
    throw new Error('Only admins can create staff accounts');
  }

  if (role === 'admin') {
    throw new Error('Admin accounts cannot be created via this API');
  }

  const user = new User({ name, email, password, role });

  let generatedPassword = password;

  if (role === 'staff') {
    generatedPassword = generateRandomPassword();
    user.password = generatedPassword

    console.log(email, name, generatedPassword);
  }
  await user.save();
  return { user, generatedPassword };
};

// Generate Password on staff creation
const generateRandomPassword = () => {
  // Generate a random password for staff account creation (you can adjust the length)
  return Math.random().toString(36).slice(-8); 
};

// Register User/ Create Satff by Admin
exports.registerOrCreateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const requesterRole = req.user?.role;

  try {
    if (role === 'staff') {
      if (!requesterRole || requesterRole !== 'admin') {
        return res.status(403).json({ message: 'Only admins can create staff accounts' });
      }
    } else if (role && role !== 'user') {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const { user, generatedPassword } = await createUser({ name, email, password, role }, requesterRole);

    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    if (role === 'staff') {
      response.generatedPassword = generatedPassword; 
    }

    if (!requesterRole || requesterRole === 'user') {
      response.token = generateToken(user._id);
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
