import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
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
    timestamps: true, // aggiunge createdAt e updatedAt
  }
);

// Prevenire recensioni duplicate sulla stessa lezione da parte dello stesso utente
reviewSchema.index({ lezione: 1, autore: 1 }, { unique: true });

export default model('Review', reviewSchema);
