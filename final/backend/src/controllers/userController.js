// controllers/userController.js

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel") 
const Admin = require("../models/adminModel")
const Lesson = require("../models/lessonModel")
const Review = require("../models/reviewModel")
const Report = require("../models/reportModel")


// 🔹 Utility: Rimuove password dal risultato
const sanitizeUser = (user) => {
  const obj = user.toObject()
  delete obj.password
  return obj
}


// ======================================================
//  CREATE USER ( / )
// ======================================================
exports.createUser = async (data) => {
  console.log("punto1");
  // Controllo se l'email è già registrata
  const existingUser = await User.findOne({ email: data.email });
  console.log("punto2");
  if (existingUser) {
    throw new Error("❌ Esiste già un account registrato con questa email");
  }

  console.log("punto3");
  // Hash della password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  console.log("punto4");
  // Creazione nuovo utente
  const user = new User({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: hashedPassword,
    degreeType: data.degreeType,
    photo: data.photo,
    birthDate: data.birthDate,
    averageGrade: data.averageGrade,
    bio: data.bio
  });
  console.log("punto5");

  await user.save();
  console.log("punto6");

  return sanitizeUser(user); // restituisce utente senza password
};


// ======================================================
//  LOGIN USER  ( /session/login )
// ======================================================
exports.loginUser = async (data, jwtSettings) => {
  const { email, password } = data;

  // Recupera l'utente con la password (select +password)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  // Confronta la password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  // Genera JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    jwtSettings.secret,
    { expiresIn: jwtSettings.expires }
  );
  console.log("Generated JWT:", token);
  console.log("User logged in:", user);

  return sanitizeUser(user);
};



// ======================================================
//  LOGOUT USER  ( /session/logout )
// ======================================================
exports.logoutUser = (socket) => {
  socket.data.user = null
}



// ======================================================
//  GET SESSION DATA ( /session )
// ======================================================
exports.getSessionData = (socket) => {
  if (!socket.data.user)
    return socket.emit("session:get:response", { error: "No session active" })

  socket.emit("session:get:response", socket.data.user)
}



// ======================================================
//  SEARCH USER BY USERNAME ( /:username )
// ======================================================
exports.searchByUsername = async (socket, username) => {
  try {
    const user = await User.findOne({ firstName: username })

    if (!user)
      return socket.emit("user:searchByUsername:response", {
        error: "User not found"
      })

    socket.emit("user:searchByUsername:response", sanitizeUser(user))

  } catch (err) {
    socket.emit("user:searchByUsername:response", { error: err.message })
  }
}



// ======================================================
//  DELETE USER (DELETE /:username)
// ======================================================
exports.deleteUser = async (socket, data) => {
  try {
    const { email, targetEmail } = data;
    console.log("Admin email:", email, "Target email:", targetEmail);
    const admin = await Admin.findOne({ emailAdmin: email });
    console.log("Admin found:", admin);
    if (!admin) {
      return { message: "Only admins can delete users" };
    }
    console.log("Admin verified:");
    // Verifica se l'utente da cancellare esiste
    const userToDelete = await User.findOne({ email: targetEmail });
    console.log("User to delete found:", userToDelete);
    if (!userToDelete) {
      return { message: "User not found" };
    }
    console.log("User verified:");
    await User.deleteOne({ email: targetEmail });
    return { message: "User successfully deleted" };  

  }catch (err) {
    throw new Error(err.message);
  }
}
exports.deleteUser = async (socket, data) => {
  try {
    const { email, targetEmail } = data;

    console.log("Admin email:", email, "Target email:", targetEmail);

    // Controllo admin
    const admin = await Admin.findOne({ emailAdmin: email });
    console.log("Admin found:", admin);

    if (!admin) {
      return { message: "Only admins can delete users" };
    }

    // Cerca l’utente da cancellare
    const userToDelete = await User.findOne({ email: targetEmail });
    console.log("User to delete found:", userToDelete);

    if (!userToDelete) {
      return { message: "User not found" };
    }

    console.log("User verified");

    // 1️⃣ Cancella tutte le lezioni dove l'utente è presente
    const lessonsDeleted = await Lesson.deleteMany({
      $or: [
        { student: targetEmail },
        { teacher: targetEmail }
      ]
    });

    console.log("Lessons deleted:", lessonsDeleted);


    // 3️⃣ Cancella tutte le valutazioni in cui appare l'utente
    const reviewsDeleted = await Review.deleteMany({
      $or: [
        { teacher: targetEmail },   // ha lasciato una valutazione
        { student: targetEmail }    // ha ricevuto una valutazione
      ]
    });

    console.log("Reviews deleted:", reviewsDeleted);

    const reportsDeleted = await Report.deleteMany({
      $or: [
        { reporter: targetEmail },   // ha fatto una segnalazione
        { reported: targetEmail }    // è stato segnalato
      ]
    });

    console.log("Reports deleted:", reportsDeleted);


    // 4️⃣ Cancella l’utente
    await User.deleteOne({ email: targetEmail });

    console.log("User deleted");

    return {
      message: "User, lessons, reviews and ratings successfully deleted"
    };

  } catch (err) {
    throw new Error(err.message);
  }
};



// ======================================================
//  SEARCH BY ID  ( /id/:id )
// ======================================================
exports.searchById = async (socket, id) => {
  try {
    const user = await User.findById(id)

    if (!user)
      return socket.emit("user:searchById:response", {
        error: "User not found"
      })

    socket.emit("user:searchById:response", sanitizeUser(user))

  } catch (err) {
    socket.emit("user:searchById:response", { error: err.message })
  }
}

exports.getUserByEmail = async (socket, email, callback) => {
  try {
    if (!email) {
      return callback({
        success: false,
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return callback({
        success: false,
        error: "User not found",
      });
    }

    console.log("Utente ottenuto per email:", user);
    callback({
      success: true,
      data: sanitizeUser(user),
    });

  } catch (err) {
    console.error("Errore ottenimento utente per email:", err, email);
    callback({
      success: false,
      error: err.message,
    });
  }
};

exports.updateUserProfile = async (socket, email, updatedData, callback) => {
  try {
    if (!email) {
      return callback({
        success: false,
        error: "Email is required",
      });
    }

    // Trova l'utente tramite email
    const user = await User.findOne({ email });

    if (!user) {
      return callback({
        success: false,
        error: "User not found",
      });
    }

    Object.keys(updatedData).forEach((key) => {
      // Evita che qualcuno cerchi di cambiare campi protetti
      if (["password", "_id", "createdAt", "updatedAt"].includes(key)) return;

      user[key] = updatedData[key];
    });

    // Salva modifiche
    const savedUser = await user.save();

    // Rimuovi campi sensibili
    const sanitized = sanitizeUser(savedUser);

    // Risposta al client
    return callback({
      success: true,
      data: sanitized,
    });

  } catch (err) {
    console.error("updateUserProfile error:", err);
    return callback({
      success: false,
      error: err.message || "Unknown error",
    });
  }
};
