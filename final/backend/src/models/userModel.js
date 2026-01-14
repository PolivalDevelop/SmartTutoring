const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
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
      match: [/^[a-z0-9._%+-]+@studio\.unibo\.it$/, "Invalid email (use your institutional address)"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, 
    },
    degreeType: {
      type: String,
      required: true,
      enum: ["triennale", "magistrale", "dottorato"],
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
