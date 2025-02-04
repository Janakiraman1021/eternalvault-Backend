const mongoose = require('mongoose');

const CapsuleSchema = new mongoose.Schema(
  {
    message: { 
      type: String, 
      required: true 
    },
    unlockDate: { 
      type: Date, 
      required: true 
    },
    filePath: { 
      type: String // Path to the uploaded file, if any
    },
    transactionHash: { 
      type: String, 
      required: true 
    },
    isUnlocked: { 
      type: Boolean, 
      default: false 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // Reference to the User model
      required: true 
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('Capsule', CapsuleSchema);
