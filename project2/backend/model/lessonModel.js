import { Schema, model } from 'mongoose';

const lessonSchema = new Schema(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    subject: {
      type: String,
      required: true,
      enum: [
        'Mathematics',
        'Physics',
        'Computer Science',
        'Chemistry',
        'Biology',
        'Economics',
        'Statistics',
        'Law',
        'Literature',
        'Engineering',
        'Other',
      ],
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // minutes, can be changed if needed
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'completed'],
      default: 'available',
    },
    notes: {
      type: String,
      maxlength: 300,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Logical validation: if a lesson is booked, it must have a student assigned
lessonSchema.pre('save', function (next) {
  if (this.status === 'booked' && !this.student) {
    return next(new Error('A booked lesson must have a student assigned.'));
  }
  next();
});

export default model('Lesson', lessonSchema);
