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
exports.createUser = async (socket, data) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      degreeType,
      photo,
      birthDate,
      averageGrade,
      bio
    } = data

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      degreeType,
      photo,
      birthDate,
      averageGrade,
      bio
    })

    await user.save()

    socket.emit("createUserResponse", {
      success: true,
      user: sanitizeUser(user)
    })

  } catch (err) {
    socket.emit("createUserResponse", { error: err.message })
  }
}



// ======================================================
//  LOGIN USER  ( /session/login )
// ======================================================
exports.loginUser = async (socket, data, jwtSettings) => {
  try {
    const { email, password } = data

    // Password ha select:false → bisogna selezionarla a mano
    const user = await User.findOne({ email }).select("+password")

    if (!user)
      return socket.emit("session:login:response", { error: "User not found" })

    const valid = await bcrypt.compare(password, user.password)

    if (!valid)
      return socket.emit("session:login:response", { error: "Invalid password" })

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSettings.secret,
      { expiresIn: jwtSettings.expires }
    )

    socket.data.user = {
      userId: user._id,
      email: user.email
    }

    socket.emit("session:login:response", {
      success: true,
      token,
      user: sanitizeUser(user)
    })

  } catch (err) {
    socket.emit("session:login:response", { error: err.message })
  }
}



// ======================================================
//  LOGOUT USER  ( /session/logout )
// ======================================================
exports.logoutUser = (socket) => {
  socket.data.user = null
  socket.emit("session:logout:response", { success: true })
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
