const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const { validateAuthPayload, cleanString } = require('../utils/validation');

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET || 'super_secret_jwt_key',
    { expiresIn: '7d' }
  );

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = async (req, res) => {
  try {
    const validation = validateAuthPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const { username, email, password } = validation.values;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with the same email or username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to register user.' });
  }
};

const login = async (req, res) => {
  try {
    const email = cleanString(req.body.email).toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to login.' });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

const updateCurrentUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const validation = validateAuthPayload({ username, email, password }, true);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const normalizedUsername = username !== undefined ? validation.values.username : user.username;
    const normalizedEmail = email !== undefined ? validation.values.email : user.email;

    if (username && normalizedUsername !== user.username) {
      const existingUsername = await User.findOne({
        where: {
          username: normalizedUsername,
          id: { [Op.ne]: user.id },
        },
      });
      if (existingUsername) {
        return res.status(409).json({ message: 'Username is already taken.' });
      }
      user.username = normalizedUsername;
    }

    if (email && normalizedEmail !== user.email) {
      const existingEmail = await User.findOne({
        where: {
          email: normalizedEmail,
          id: { [Op.ne]: user.id },
        },
      });
      if (existingEmail) {
        return res.status(409).json({ message: 'Email is already taken.' });
      }
      user.email = normalizedEmail;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully.',
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update profile.' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
};
