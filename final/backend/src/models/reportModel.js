const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // User who submits the report
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reported user
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reason selected from the dropdown menu
    reason: {
      type: String,
      required: true,
      enum: [
        "inappropriate-content",
        "offensive-language",
        "fake-profile",
        "other",
      ],
    },

    // Text description provided by the user
    details: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },

    // Report status (admin use)
    status: {
      type: String,
      enum: ["pending", "under_review", "resolved", "rejected"],
      default: "pending",
    },

    // Optional: admin response
    adminResponse: {
      type: String,
      maxlength: 500,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent a user from reporting themselves
reportSchema.pre("save", function (next) {
  if (!this.reporter.equals(this.reportedUser)) {
    next();
  } else {
    next(new Error("A user cannot report themselves."));
  }
});

module.exports = mongoose.model("Report", reportSchema);
