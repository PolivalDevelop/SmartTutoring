// Seleziona il database
db = db.getSiblingDB("tutoring");

// Funzione per generare un hash SHA-256 (Mongo supporta crypto nativamente)
function hashPassword(password) {
    return HexData(0, crypto().digest("sha256").update(password).digest("hex"));
}

// Creazione utenti demo solo se la collection è vuota
if (db.users.countDocuments() === 0) {

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
        }
    ];

    db.users.insertMany(users);
    print("🌱 Users inserted successfully!");
} else {
    print("ℹ️ Users already exist, skipping...");
}

// Inserimento lezioni demo
if (db.lessons.countDocuments() === 0) {
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
        }
    ];

    db.lessons.insertMany(lessons);
    print("📚 Lessons inserted successfully!");
} else {
    print("ℹ️ Lessons already exist, skipping...");
}

