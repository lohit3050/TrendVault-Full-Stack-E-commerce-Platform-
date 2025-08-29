const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
      shopName: user.shopName
    }});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ ADD: Get current user route
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
      shopName: user.shopName
    }});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller,
        shopName: user.shopName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller,
        shopName: user.shopName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enable seller mode
router.put('/enable-seller', auth, async (req, res) => {
  try {
    const { shopName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { isSeller: true, shopName },
      { new: true }
    ).select('-password');

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isSeller: updatedUser.isSeller,
        shopName: updatedUser.shopName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
