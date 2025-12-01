const crypto = require("crypto");

// Funzione per hashare le password
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Array di utenti
const users = [
  {
    id: "user-1",
    firstName: "Daniele",
    lastName: "Capannini",
    email: "daniele.capannini@studio.unibo.it",
    password: hashPassword("Password01!"),
    degreeType: "magistrale",
    photo: null,
    birthDate: new Date("1999-05-21"),
    averageGrade: 28,
    bio: "Studente appassionato di informatica."
  },
  {
    id: "user-2",
    firstName: "Giulia",
    lastName: "Rossi",
    email: "giulia.rossi@studio.unibo.it",
    password: hashPassword("Password02!"),
    degreeType: "triennale",
    photo: null,
    birthDate: new Date("2001-08-10"),
    averageGrade: 27,
    bio: "Studentessa magistrale in ingegneria."
  },
  {
    id: "user-3",
    firstName: "Luca",
    lastName: "Bianchi",
    email: "luca.bianchi@studio.unibo.it",
    password: hashPassword("Password03!"),
    degreeType: "dottorato",
    photo: null,
    birthDate: new Date("1995-02-14"),
    averageGrade: 30,
    bio: "Dottorando in matematica applicata."
  },
  {
    id: "user-4",
    firstName: "Daniel",
    lastName: "Capannini",
    email: "daniel.capannini@studio.unibo.it",
    password: hashPassword("Password01!"),
    degreeType: "magistrale",
    photo: null,
    birthDate: new Date("2001-04-12"),
    averageGrade: 30,
    bio: "proprietario di sta app."
  },
  {
    id: "user-4",
    firstName: "Luca",
    lastName: "Cantagallo",
    email: "luca.cantagallo@studio.unibo.it",
    password: hashPassword("Password01!"),
    degreeType: "magistrale",
    photo: null,
    birthDate: new Date("2001-04-12"),
    averageGrade: 30,
    bio: "proprietario di sta app."
  }
];

    const admin = [{
      email: "daniel.capannini@studio.unibo.it"
    },
    {
      email: "luca.cantagallo@studio.unibo.it"
    }
];

// Array di lezioni
const lessons = [
  {
    id: "lesson-1",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    subject: "Analisi",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // tra 3 giorni
    duration: 60,
    price: 20,
    status: "available",
    notes: "Introduzione ai limiti e derivate."
  },
  {
    id: "lesson-2",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    subject: "Ingegneria del software",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // tra 5 giorni
    duration: 90,
    price: 30,
    status: "available",
    notes: "Design pattern e principi SOLID."
  },
  {
    id: "lesson-3",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    subject: "Basi di dati",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // tra 7 giorni
    duration: 60,
    price: 25,
    status: "available",
    notes: "Esercitazione sulle query SQL."
  },
  {
    id: "lesson-4",
    teacher: "luca.bianchi@studio.unibo.it",
    student: null,
    subject: "Algebra e Geometria",
    date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    duration: 60,
    price: 22,
    status: "available",
    notes: "Grafi e combinatoria di base."
  },
  {
    id: "lesson-5",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    subject: "Algoritmi",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    duration: 90,
    price: 35,
    status: "available",
    notes: "Analisi della complessità e tecniche di programmazione dinamica."
  },
  {
    id: "lesson-6",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: null,
    subject: "Reti di Calcolatori",
    date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    duration: 60,
    price: 25,
    status: "available",
    notes: "Livelli OSI e protocolli TCP/IP."
  },
  {
    id: "lesson-7",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    subject: "Programmazione Web",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    duration: 120,
    price: 40,
    status: "available",
    notes: "Introduzione a Node.js e Express."
  },
  {
    id: "lesson-8",
    teacher: "luca.bianchi@studio.unibo.it",
    student: null,
    subject: "Algoritmi",
    date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
    duration: 60,
    price: 28,
    status: "available",
    notes: "Metodi iterativi per sistemi lineari."
  },
  {
    id: "lesson-9",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    subject: "Ingegneria del Software",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    duration: 90,
    price: 30,
    status: "available",
    notes: "Test driven development (TDD)."
  },
  {
    id: "lesson-10",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: null,
    subject: "Sistemi Operativi",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    duration: 60,
    price: 26,
    status: "available",
    notes: "Scheduling e gestione della memoria."
  },
  {
    id: "lesson-11",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    subject: "Basi di Dati",
    date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    duration: 60,
    price: 25,
    status: "available",
    notes: "Progettazione concettuale e schema ER."
  },
  {
    id: "lesson-12",
    teacher: "luca.bianchi@studio.unibo.it",
    student: null,
    subject: "Probabilità e Statistica",
    date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    duration: 60,
    price: 22,
    status: "available",
    notes: "Variabili aleatorie e distribuzioni principali."
  },
  {
    id: "lesson-13",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    subject: "Machine Learning",
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    duration: 120,
    price: 45,
    status: "available",
    notes: "Regressione lineare e overfitting."
  }
];


const reviews = [
  {
    id: "review-1",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "daniele.capannini@studio.unibo.it",
    rating: 5,
    comment: "Ottima spiegazione e molto disponibile."
  },
  {
    id: "review-2",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "luca.bianchi@studio.unibo.it",
    rating: 4,
    comment: "Lezione chiara, ma un po' veloce."
  },
  {
    id: "review-3",
    teacher: "luca.bianchi@studio.unibo.it",
    student: "daniele.capannini@studio.unibo.it",
    rating: 5,
    comment: "Spiegazioni estremamente chiare e dettagliate."
  },
  {
    id: "review-4",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: "daniele.capannini@studio.unibo.it",
    rating: 4,
    comment: "Molto preparato, ottimo approccio."
  },
  {
    id: "review-5",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "daniel.capannini@studio.unibo.it",
    rating: 5,
    comment: "Lezione perfetta, ha chiarito tutti i miei dubbi."
  },
  {
    id: "review-6",
    teacher: "luca.bianchi@studio.unibo.it",
    student: "daniel.capannini@studio.unibo.it",
    rating: 4,
    comment: "Buona lezione, qualche parte un po' complessa."
  },
  {
    id: "review-7",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: "daniel.capannini@studio.unibo.it",
    rating: 5,
    comment: "Molto bravo e super disponibile."
  },
  {
    id: "review-8",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "luca.cantagallo@studio.unibo.it",
    rating: 3,
    comment: "Spiegazione ok, ma poteva essere più approfondita."
  },
  {
    id: "review-9",
    teacher: "luca.bianchi@studio.unibo.it",
    student: "luca.cantagallo@studio.unibo.it",
    rating: 5,
    comment: "Ottimo docente, super consigliato."
  },
  {
    id: "review-10",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: "luca.bianchi@studio.unibo.it",
    rating: 4,
    comment: "Ben strutturata la lezione, molto utile."
  },
  {
    id: "review-11",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "luca.bianchi@studio.unibo.it",
    rating: 5,
    comment: "Molto migliorata rispetto alla volta precedente."
  },
  {
    id: "review-12",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: "luca.cantagallo@studio.unibo.it",
    rating: 5,
    comment: "Ottima padronanza dell’argomento."
  }
];


// Esportiamo i dati usando CommonJS
module.exports = { users, lessons, reviews };