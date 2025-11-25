const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Prevent duplicate reviews for the same lesson by the same user
reviewSchema.index({ lesson: 1, author: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
