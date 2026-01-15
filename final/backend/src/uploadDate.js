const crypto = require("crypto");


const users = [
  {
    id: "user-1",
    firstName: "Elisa",
    lastName: "Ruffini",
    email: "elisa.ruffini@studio.unibo.it",
    password: "Password01!",
    degreeType: "triennale",
    photo: null,
    birthDate: new Date("2005-05-15"),
    averageGrade: 26,
    bio: "Studente di ingegneria e scienze informatiche, al secondo anno di triennale."
  },
  {
    id: "user-2",
    firstName: "Giulia",
    lastName: "Rossi",
    email: "giulia.rossi@studio.unibo.it",
    password: "Password02!",
    degreeType: "dottorato",
    photo: "/uploads/giulia.jpeg",
    birthDate: new Date("2000-08-10"),
    averageGrade: 30,
    bio: "Dottoranda in Business Intelligence."
  },
  {
    id: "user-3",
    firstName: "Luca",
    lastName: "Bianchi",
    email: "luca.bianchi@studio.unibo.it",
    password: "Password03!",
    degreeType: "dottorato",
    photo: null,
    birthDate: new Date("1995-02-14"),
    averageGrade: 30,
    bio: "Dottorando in visione artificiale."
  },
  {
    id: "user-4",
    firstName: "Daniel",
    lastName: "Capannini",
    email: "daniel.capannini@studio.unibo.it",
    password: "Password01!",  
    degreeType: "magistrale",
    photo: "/uploads/daniel.jpg",
    birthDate: new Date("2001-04-12"),
    averageGrade: 27,
    bio: "Cofondatore di SmartTutoring e amministratore dell'applicazione."
  },
  {
    id: "user-5",
    firstName: "Luca",
    lastName: "Cantagallo",
    email: "luca.cantagallo@studio.unibo.it",
    password: "Password01!",
    degreeType: "magistrale",
    photo: "/uploads/Luca.JPG",
    birthDate: new Date("1999-08-15"),
    averageGrade: 29,
    bio: "Cofondatore di SmartTutoring e amministratore dell'applicazione."
  },
  {
    id: "user-6",
    firstName: "Francesca",
    lastName: "Proni",
    email: "francesca.proni@studio.unibo.it",
    password: "Password01!",
    degreeType: "triennale",
    photo: null,
    birthDate: new Date("2003-11-18"),
    averageGrade: 25,
    bio: "Studentessa triennale e appassionata di intelligenza artificiale."
  },
  {
    id: "user-7",
    firstName: "Valerio",
    lastName: "Di Zio",
    email: "valerio.di.zio@studio.unibo.it",
    password: "Password01!",
    degreeType: "magistrale",
    photo: null,
    birthDate: new Date("2000-12-28"),
    averageGrade: 30,
    bio: "Prossimo alla Laurea."
  }
];

const admins = [{
      emailAdmin: "daniel.capannini@studio.unibo.it"
    },
    {
      emailAdmin: "luca.cantagallo@studio.unibo.it"
    }
];

const lessons = [
  {
    id: "lesson-1",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    time: "9:00",
    subject: "Analisi",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
    duration: 60,
    price: 20,
    status: "available",
    notes: "Introduzione ai limiti e derivate."
  },
  {
    id: "lesson-2",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    time: "10:00",
    subject: "Ingegneria del software",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    duration: 90,
    price: 30,
    status: "available",
    notes: "Design pattern e principi SOLID."
  },
  {
    id: "lesson-3",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    time: "11:00",
    subject: "Basi di Dati",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    duration: 60,
    price: 25,
    status: "available",
    notes: "Esercitazione sulle query SQL."
  },
  {
    id: "lesson-4",
    teacher: "luca.bianchi@studio.unibo.it",
    student: null,
    time: "9:30",
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
    time: "10:30",
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
    time: "11:30",
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
    time: "12:00",
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
    time: "13:00",
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
    time: "14:00",
    subject: "Ingegneria del software",
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
    time: "15:00",
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
    time: "16:00",
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
    time: "17:00",
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
    time: "18:00",
    subject: "Machine Learning",
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    duration: 120,
    price: 45,
    status: "available",
    notes: "Regressione lineare e overfitting."
  },
  {
    id: "lesson-14",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "daniel.capannini@studio.unibo.it",
    time: "18:00",
    subject: "PPS",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    duration: 120,
    price: 45,
    status: "booked",
    notes: "Regressione lineare e overfitting."
  },
  {
    id: "lesson-15",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "luca.cantagallo@studio.unibo.it",
    time: "14:00",
    subject: "Machine Learning",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    duration: 120,
    price: 20,
    status: "booked",
    notes: "Regressione lineare e overfitting."
  },
  {
    id: "lesson-16",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "daniel.capannini@studio.unibo.it",
    time: "12:00",
    subject: "Basi di Dati",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    duration: 90,
    price: 15,
    status: "booked",
    notes: "Regressione lineare e overfitting."
  },
  {
    id: "lesson-17",
    teacher: "manuel.andruccioli@studio.unibo.it",
    student: null,
    time: "9:00",
    subject: "Applicazioni Web",
    date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    duration: 90,
    price: 30,
    status: "available",
    notes: "Introduzione a REST API e architettura client-server."
  },
  {
    id: "lesson-18",
    teacher: "manuel.andruccioli@studio.unibo.it",
    student: null,
    time: "11:00",
    subject: "Applicazioni Web",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    duration: 120,
    price: 35,
    status: "available",
    notes: "Async/await, promise e gestione degli errori."
  },
  {
    id: "lesson-19",
    teacher: "luca.bianchi@studio.unibo.it",
    student: null,
    time: "14:00",
    subject: "Visione Artificiale",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    duration: 120,
    price: 40,
    status: "available",
    notes: "Introduzione al riconoscimento di immagini."
  },
  {
    id: "lesson-20",
    teacher: "giulia.rossi@studio.unibo.it",
    student: null,
    time: "18:00",
    subject: "Business Intelligence",
    date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    duration: 120,
    price: 45,
    status: "available",
    notes: "Data warehouse e strumenti di analisi."
  }
];


const reviews = [
  {
    id: "review-1",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "elisa.ruffini@studio.unibo.it",
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
    student: "elisa.ruffini@studio.unibo.it",
    rating: 5,
    comment: "Spiegazioni estremamente chiare e dettagliate."
  },
  {
    id: "review-4",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: "elisa.ruffini@studio.unibo.it",
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
    teacher: "manuel.andruccioli@studio.unibo.it",
    student: "elisa.ruffini@studio.unibo.it",
    rating: 5,
    comment: "Lezione molto chiara e ben organizzata."
  },
  {
    id: "review-12",
    teacher: "manuel.andruccioli@studio.unibo.it",
    student: "daniel.capannini@studio.unibo.it",
    rating: 4,
    comment: "Ottima spiegazione, esempi pratici utilissimi."
  },
  {
    id: "review-13",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "francesca.proni@studio.unibo.it",
    rating: 5,
    comment: "Spiegazioni semplici e molto efficaci."
  },
  {
    id: "review-14",
    teacher: "luca.bianchi@studio.unibo.it",
    student: "francesca.proni@studio.unibo.it",
    rating: 4,
    comment: "Lezione interessante e ben strutturata."
  },
  {
    id: "review-15",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: "francesca.proni@studio.unibo.it",
    rating: 5,
    comment: "Molto disponibile e preparato."
  },
  {
    id: "review-16",
    teacher: "giulia.rossi@studio.unibo.it",
    student: "manuel.andruccioli@studio.unibo.it",
    rating: 4,
    comment: "Contenuti chiari, ritmo un po’ veloce ma efficace."
  },
  {
    id: "review-17",
    teacher: "luca.bianchi@studio.unibo.it",
    student: "manuel.andruccioli@studio.unibo.it",
    rating: 5,
    comment: "Ottima capacità di spiegare concetti complessi."
  },
  {
    id: "review-18",
    teacher: "manuel.andruccioli@studio.unibo.it",
    student: "luca.cantagallo@studio.unibo.it",
    rating: 4,
    comment: "Lezione pratica e molto utile."
  },
  {
    id: "review-19",
    teacher: "luca.cantagallo@studio.unibo.it",
    student: "manuel.andruccioli@studio.unibo.it",
    rating: 5,
    comment: "Spiegazione chiara e ben approfondita."
  }
];

const reports = [
  {
    reporter: "elisa.ruffini@studio.unibo.it",
    reported: "giulia.rossi@studio.unibo.it",
    reason: "comportamento-scorretto",
    comment: "Durante una lezione online ha mostrato poca disponibilità nel rispondere alle domande.",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
  },
  {
    reporter: "luca.bianchi@studio.unibo.it",
    reported: "elisa.ruffini@studio.unibo.it",
    reason: "linguaggio-offensivo",
    comment: "Ha utilizzato un tono di voce e un linguaggio inappropriato durante la collaborazione.",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
  },
  {
    reporter: "elisa.ruffini@studio.unibo.it",
    reported: "luca.bianchi@studio.unibo.it",
    reason: "contenuti-inappropriati",
    comment: "Ha condiviso materiale non pertinente e non appropriato alla lezione.",
    status: "pending",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), 
  },
  {
    reporter: "giulia.rossi@studio.unibo.it",
    reported: "luca.bianchi@studio.unibo.it",
    reason: "spam-pubblicita",
    comment: "Ha inviato messaggi pubblicitari non richiesti durante una sessione di tutoraggio.",
    status: "pending",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), 
  },
  {
    reporter: "giulia.rossi@studio.unibo.it",
    reported: "elisa.ruffini@studio.unibo.it",
    reason: "altro",
    comment: "Comportamento ambiguo e disturbante durante le attività del gruppo di studio.",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), 
  }
]



module.exports = { users, lessons, reviews, admins, reports };