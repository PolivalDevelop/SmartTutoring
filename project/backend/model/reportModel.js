import { Schema, model } from 'mongoose';

const reportSchema = new Schema(
  {
    // User who submits the report
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Reported user
    reportedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Reason selected from the dropdown menu
    reason: {
      type: String,
      required: true,
      enum: [
        'inappropriate-content',
        'offensive-language',
        'fake-profile',
        'other',
      ],
    },

    // Text description provided by the user
    details: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },

    // Report status, useful for the admin side
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'rejected'],
      default: 'pending',
    },

    // Optional: admin’s response or note
    adminResponse: {
      type: String,
      maxlength: 500,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Optional logical validation
reportSchema.pre('save', function (next) {
  if (!this.reporter.equals(this.reportedUser)) {
    next();
  } else {
    next(new Error('A user cannot report themselves.'));
  }
});

export default model('Report', reportSchema);
