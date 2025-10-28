const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User') // importa il modello Mongoose

module.exports = function (jwtSettings) {
const router = express.Router()

// ===============================
// CREATE USER (registrazione)
// ===============================
router.post('/', async (req, res) => {
try {
const { nome, cognome, email, password, tipo, foto, nascita, media, bio } = req.body

  // Controlla se esiste già
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: 'Email già registrata' })

  // Cripta password
  const hashed = await bcrypt.hash(password, 10)

  const newUser = new User({
    nome,
    cognome,
    email,
    password: hashed,
    tipo,
    foto: foto || null,
    nascita: nascita || null,
    media: media || null,
    bio: bio || '',
  })

  const saved = await newUser.save()
  res.status(201).json({
    message: 'Utente creato con successo',
    user: { userId: saved.userId, nome: saved.nome, cognome: saved.cognome, email: saved.email },
  })
} catch (err) {
  console.error(err)
  res.status(500).json({ message: 'Errore creazione utente', error: err.message })
}


})

// ===============================
// LOGIN (crea sessione + JWT)
// ===============================
router.post('/session/login', async (req, res) => {
try {
const { email, password } = req.body
const user = await User.findOne({ email }).select('+password')

  if (!user) return res.status(404).json({ message: 'Utente non trovato' })
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ message: 'Password errata' })

  // Crea token JWT
  const token = jwt.sign(
    { id: user.userId, email: user.email, tipo: user.tipo },
    jwtSettings.secret,
    { expiresIn: '24h' }
  )

  // Salva sessione
  req.session.user = {
    userId: user.userId,
    nome: user.nome,
    cognome: user.cognome,
    email: user.email,
    tipo: user.tipo,
  }

  res.json({ message: 'Login riuscito', token, user: req.session.user })
} catch (err) {
  console.error(err)
  res.status(500).json({ message: 'Errore durante il login', error: err.message })
}


})

// ===============================
// LOGOUT (rimuove sessione)
// ===============================
router.post('/session/logout', (req, res) => {
req.session.destroy(() => {
res.json({ message: 'Logout effettuato con successo' })
})
})

// ===============================
// DATI SESSIONE ATTUALE
// ===============================
router.get('/session', (req, res) => {
if (req.session.user) {
res.json({ loggedIn: true, user: req.session.user })
} else {
res.json({ loggedIn: false })
}
})

// ===============================
// GET USER BY USERNAME
// ===============================
router.get('/:username', async (req, res) => {
try {
const username = req.params.username.toLowerCase()
const user = await User.findOne({
$or: [
{ nome: new RegExp(username, 'i') },
{ cognome: new RegExp(username, 'i') },
],
}).select('-password')

  if (!user) return res.status(404).json({ message: 'Utente non trovato' })
  res.json(user)
} catch (err) {
  res.status(500).json({ message: 'Errore ricerca utente', error: err.message })
}


})

// ===============================
// GET USER BY ID (userId)
// ===============================
router.get('/id/:id', async (req, res) => {
try {
const user = await User.findOne({ userId: req.params.id }).select('-password')
if (!user) return res.status(404).json({ message: 'Utente non trovato' })
res.json(user)
} catch (err) {
res.status(500).json({ message: 'Errore ricerca per ID', error: err.message })
}
})

// ===============================
// DELETE USER BY USERNAME
// ===============================
router.delete('/:username', async (req, res) => {
    try {
        const result = await User.findOneAndDelete({ nome: req.params.username })
        if (!result) return res.status(404).json({ message: 'Utente non trovato' })
        res.json({ message: 'Utente eliminato con successo' })
    } catch (err) {
        res.status(500).json({ message: 'Errore durante l\'eliminazione', error: err.message })
    }
})

return router
}