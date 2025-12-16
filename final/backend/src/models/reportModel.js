const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: String,    
      required: true,
      trim: true,
    },
    reported: {
      type: String,      
      required: true,
      trim: true,
    },

    // Reason selected from the dropdown menu
    reason: {
      type: String,
      required: true,
      enum: [
        "contenuti-inappropriati",
        "linguaggio-offensivo",
        "comportamento-scorretto",
        "spam-pubblicita",
        "altro",
      ],
    },

    // Text description provided by the user
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },

    // Report status (admin use)
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },

    // Optional: admin response
    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent a user from reporting themselves
reportSchema.pre("save", function (next) {
  if (this.reporter !== this.reportedUser) {
    next();
  } else {
    next(new Error("A user cannot report themselves."));
  }
});

module.exports = mongoose.model("Report", reportSchema);
