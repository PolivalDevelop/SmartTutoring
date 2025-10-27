import { Schema, model, Document, Types } from 'mongoose';

// Interfaccia per il documento Review
export interface IReview extends Document {
  lezione: Types.ObjectId;
  autore: Types.ObjectId;
  valutazione: number;
  commento: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema Mongoose
const reviewSchema = new Schema<IReview>(
  {
    lezione: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    autore: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    valutazione: {
      type: Number,
      required: true,
      min: [1, 'La valutazione minima è 1'],
      max: [5, 'La valutazione massima è 5'],
    },
    commento: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt e updatedAt
  }
);

// Prevenire recensioni duplicate sulla stessa lezione da parte dello stesso utente
reviewSchema.index({ lezione: 1, autore: 1 }, { unique: true });

// Modello Mongoose tipizzato
const Review = model<IReview>('Review', reviewSchema);

export default Review;
