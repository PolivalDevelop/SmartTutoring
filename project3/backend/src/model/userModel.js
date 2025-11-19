import { Schema, model } from 'mongoose';

const userSchema = new Schema(
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
      match: [/^[a-z]+\.[a-z]+@studio\.unibo\.it$/, 'Invalid email (use your institutional address)'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // excludes password when querying
    },
    degreeType: {
      type: String,
      required: true,
      enum: ['bachelor', 'master', 'phd'],
    },
    photo: {
      type: String, // URL or file path
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
      default: '',
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export default model('User', userSchema);
