const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subject: {
      type: String,
      required: true,
      enum: [
        "Mathematics",
        "Physics",
        "Computer Science",
        "Chemistry",
        "Biology",
        "Economics",
        "Statistics",
        "Law",
        "Literature",
        "Engineering",
        "Other",
      ],
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // minutes
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["available", "booked", "completed"],
      default: "available",
    },
    notes: {
      type: String,
      maxlength: 300,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Validation: a booked lesson must have a student assigned
lessonSchema.pre("save", function (next) {
  if (this.status === "booked" && !this.student) {
    return next(new Error("A booked lesson must have a student assigned."));
  }
  next();
});

module.exports = mongoose.model("Lesson", lessonSchema);
