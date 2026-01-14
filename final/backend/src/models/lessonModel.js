const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const lessonSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    teacher: {
      type: String,       
      required: true,
      trim: true,
    },
    student: {
      type: String,      
      default: null,
      trim: true,
    },
    time: {
      type: String,       
      default: "9:00",
      trim: true,
    },  
    subject: {
      type: String,
      required: true,
      enum: [
        "Analisi",
        "Ingegneria del software",
        "OOP",
        "Basi di Dati",
        "Big data",
        "Project Management",
        "PPS",
        "Algebra e Geometria",
        "Algoritmi",
        "Reti di Calcolatori",
        "Programmazione Web",
        "Sistemi Operativi",
        "Machine Learning",
        "Probabilità e Statistica",
      ],
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, 
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["available", "booked", "completed"],
      default: "available",
    },
    notes: {
      type: String,
      maxlength: 300,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.pre("save", function (next) {
  if (this.status === "booked" && !this.student) {
    return next(new Error("A booked lesson must have a student assigned."));
  }
  next();
});

module.exports = mongoose.model("Lesson", lessonSchema);
