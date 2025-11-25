// controllers/userController.js

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel") // adattalo al tuo export default
                                           // (User in CommonJS)


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

  return {
    token,
    user: sanitizeUser(user)
  };
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
    const { email, password } = data

    const user = await User.findOne({ email }).select("+password")

    if (!user)
      return socket.emit("user:delete:response", { error: "User not found" })

    const valid = await bcrypt.compare(password, user.password)

    if (!valid)
      return socket.emit("user:delete:response", { error: "Invalid password" })

    await User.deleteOne({ _id: user._id })

    socket.emit("user:delete:response", {
      success: true,
      message: "User deleted successfully"
    })

  } catch (err) {
    socket.emit("user:delete:response", { error: err.message })
  }
}



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
