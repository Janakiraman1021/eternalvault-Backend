const express = require('express');
const multer = require('multer');
const path = require('path');
const Capsule = require('../models/Capsule');
const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Save in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Timestamped filenames
  },
});
const upload = multer({ storage });

// Create Capsule (Authenticated)
router.post('/create', authenticateUser, upload.single('file'), async (req, res) => {
  try {
    const { message, unlockDate, transactionHash } = req.body;

    if (!message || !unlockDate || !transactionHash) {
      return res
        .status(400)
        .json({ message: 'Message, unlock date, and transaction hash are required.' });
    }

    const newCapsule = new Capsule({
      user: req.user.id, // Associate with the logged-in user
      message,
      unlockDate,
      transactionHash,
      file: req.file ? req.file.path : null,
    });

    await newCapsule.save();
    res.status(201).json({ message: 'Capsule created successfully', capsule: newCapsule });
  } catch (error) {
    console.error('Error creating capsule:', error);
    res.status(500).json({ message: 'Failed to create capsule', error: error.message });
  }
});

// Get All Capsules (Authenticated)
router.get('/', authenticateUser, async (req, res) => {
  try {
    const capsules = await Capsule.find({ user: req.user.id }); // User-specific capsules
    res.status(200).json(capsules);
  } catch (error) {
    console.error('Error fetching capsules:', error);
    res.status(500).json({ message: 'Failed to fetch capsules' });
  }
});

// Unlock Capsule
router.put('/unlock/:id', authenticateUser, async (req, res) => {
  try {
    const capsule = await Capsule.findOne({ _id: req.params.id, user: req.user.id });

    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    const currentTimestamp = new Date().getTime();
    const unlockTimestamp = new Date(capsule.unlockDate).getTime();

    if (currentTimestamp < unlockTimestamp) {
      return res.status(400).json({ message: 'Capsule cannot be unlocked yet' });
    }

    capsule.isUnlocked = true;
    await capsule.save();

    res.status(200).json({ message: 'Capsule unlocked successfully', capsule });
  } catch (error) {
    console.error('Error unlocking capsule:', error);
    res.status(500).json({ message: 'Failed to unlock capsule', error: error.message });
  }
});

module.exports = router;
