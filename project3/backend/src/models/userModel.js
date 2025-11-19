const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z]+\.[a-z]+@studio\.unibo\.it$/, "Invalid email (use your institutional address)"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Exclude password in queries
    },
    degreeType: {
      type: String,
      required: true,
      enum: ["bachelor", "master", "phd"],
    },
    photo: {
      type: String,
      default: null,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    averageGrade: {
      type: Number,
      min: 18,
      max: 30,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 200,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
