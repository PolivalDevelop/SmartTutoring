import mongoose, { Document, Schema } from "mongoose";

// Enum TypeScript per il campo "tipo"
export type UserType = 'triennale' | 'magistrale' | 'dottorato';

// Interfaccia per il documento User
export interface IUser extends Document {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  tipo: UserType;
  foto: string | null;
  nascita: Date | null;
  media: number | null;
  bio: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema Mongoose
const userSchema = new Schema<IUser>(
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
      match: [
        /^[a-z]+\.[a-z]+@studio\.unibo\.it$/,
        'Email non valida (usa quella istituzionale)',
      ],
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
    timestamps: true, // createdAt e updatedAt
  }
);

// Modello Mongoose tipizzato
const User = model<IUser>('User', userSchema);

export default User;
