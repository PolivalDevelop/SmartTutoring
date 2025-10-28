import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema(
  {
    userId: {
      type: String,
      default: uuidv4, // genera automaticamente un UUID
      unique: true,    // garantisce unicità nel database
      immutable: true, // non può essere modificato
    },
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    cognome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z]+\.[a-z]+@studio\.unibo\.it$/, 'Email non valida (usa quella istituzionale)'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    tipo: {
      type: String,
      required: true,
      enum: ['triennale', 'magistrale', 'dottorato'],
    },
    foto: {
      type: String,
      default: null,
    },
    nascita: {
      type: Date,
      default: null,
    },
    media: {
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
    timestamps: true,
  }
);

export default model('User', userSchema);
