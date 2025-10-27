import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
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
      select: false, // esclude il campo quando fai find()
    },
    tipo: {
      type: String,
      required: true,
      enum: ['triennale', 'magistrale', 'dottorato'],
    },
    foto: {
      type: String, // puoi salvare URL o percorso del file
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
    timestamps: true, // aggiunge createdAt e updatedAt automaticamente
  }
);

export default model('User', userSchema);
