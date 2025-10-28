import { Schema, model } from 'mongoose';

const lessonSchema = new Schema(
  {
    docente: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studente: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    materia: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Date,
      required: true,
    },
    durata: {
      type: Number,
      default: 60, // minuti, puoi cambiare se serve
    },
    costo: {
      type: Number,
      required: true,
      min: 0,
    },
    stato: {
      type: String,
      enum: ['libera', 'prenotata', 'completata'],
      default: 'libera',
    },
    note: {
      type: String,
      maxlength: 300,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Validazione logica: se una lezione è prenotata, deve avere uno studente
lessonSchema.pre('save', function (next) {
  if (this.stato === 'prenotata' && !this.studente) {
    return next(new Error('Una lezione prenotata deve avere uno studente associato.'));
  }
  next();
});

export default model('Lesson', lessonSchema);