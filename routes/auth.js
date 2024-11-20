const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { walletId, username, password } = req.body;

  if (!walletId || !username || !password) {
    return res.status(400).json({ message: 'Wallet ID, Username, and Password are required.' });
  }

  try {
    const existingUser = await User.findOne({ walletId });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this Wallet ID already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ walletId, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { walletId, password } = req.body;

  if (!walletId || !password) {
    return res.status(400).json({ message: 'Wallet ID and Password are required.' });
  }

  try {
    const user = await User.findOne({ walletId });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
