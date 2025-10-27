import mongoose, { Document, Schema } from "mongoose";

// Interfaccia per il documento Lesson
export interface ILesson extends Document {
  docente: Types.ObjectId;
  studente: Types.ObjectId | null;
  materia: string;
  data: Date;
  durata: number;
  costo: number;
  stato: 'libera' | 'prenotata' | 'completata' | 'annullata';
  note: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema Mongoose
const lessonSchema = new Schema<ILesson>(
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
      default: 60,
    },
    costo: {
      type: Number,
      required: true,
      min: 0,
    },
    stato: {
      type: String,
      enum: ['libera', 'prenotata', 'completata', 'annullata'],
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
    timestamps: true,
  }
);

// Validazione logica: se una lezione è prenotata, deve avere uno studente
lessonSchema.pre('save', function (next) {
  const lesson = this as ILesson;
  if (lesson.stato === 'prenotata' && !lesson.studente) {
    return next(new Error('Una lezione prenotata deve avere uno studente associato.'));
  }
  next();
});

// Modello Mongoose
const Lesson = model<ILesson>('Lesson', lessonSchema);

export default Lesson;
