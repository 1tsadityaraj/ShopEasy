const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Channel name is required'],
    trim: true,
    minlength: [2, 'Channel name must be at least 2 characters long'],
    maxlength: [50, 'Channel name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    default: ''
  },
  type: {
    type: String,
    enum: ['public', 'private', 'direct'],
    default: 'public'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
channelSchema.index({ members: 1 });
channelSchema.index({ type: 1 });
channelSchema.index({ createdBy: 1 });

// Virtual for member count
channelSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Ensure virtual fields are serialized
channelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Channel', channelSchema);
