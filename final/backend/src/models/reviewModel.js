const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const reviewSchema = new mongoose.Schema(
  {
    id: {
          type: String,
          unique: true,
          default: () => uuidv4(),
    },
    teacher: {
      type: String,       // email del teacher
      required: true,
      trim: true,
    },
    student: {
      type: String,       // email dello studente
      required: true,
      trim: true,
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

module.exports = mongoose.model("Review", reviewSchema);
