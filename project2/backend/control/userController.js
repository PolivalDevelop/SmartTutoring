const { userModel } = require('../models/userModel')
const { postModel } = require('../models/postModel')
const bcrypt = require('bcrypt')
const defaultImage = require('fs').readFileSync('public/DefaultPfp.png')
const jwt = require('jsonwebtoken')

exports.searchByUsername = (req, res) => {
  userModel.findOne({ username: req.params.username })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'User not found' })
      }

      const formattedImage = {
        data: result.image.data.toString('base64'),
        contentType: result.image.contentType
      }

      const formattedUser = {
        ...result.toObject(),
        image: formattedImage
      }

      res.json(formattedUser)
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}

exports.searchById = (req, res) => {

  userModel.findOne({ _id: req.params.id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'User not found' })
      }

      const formattedImage = {
        data: result.image.data.toString('base64'),
        contentType: result.image.contentType
      }

      const formattedUser = {
        ...result.toObject(),
        image: formattedImage
      }

      res.json(formattedUser)
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}

exports.createUser = (req, res) => {
  const { username, email, password, degreeType, birthDate, avgGrade, bio, image } = req.body

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error while encrypting password', error: err })
    }

    const formattedImage = image ? {
      data: Buffer.from(image, 'base64'), contentType: 'image/jpeg'
    } : {
      data: defaultImage, contentType: 'image/png'
    }

    const user = new userModel({
      username, email, password: hashedPassword, image: formattedImage, degreeType, birthDate, avgGrade, bio
    })

    user.save()
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error creating the user', error: err})
      })
  })
}

exports.deleteUser = (req, res) => {
  const username = req.params.username
  const password = req.body.password

  // Search user by username
  userModel.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Compare password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Server error during password comparison' })
        }

        if (!isMatch) {
          return res.status(401).json({ message: 'Incorrect password' })
        }

        // Delete user if password is correct
        userModel.deleteOne({ username })
          .then(() => {
            res.json({ message: 'User deleted successfully' })

            // Delete all posts from the user
            postModel.deleteMany({ user: user._id })
          })
          .catch((error) => {
            res.status(500).json({ message: 'Error deleting user', error })
          })
      })
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error finding user', error })
    })
}

exports.getAllUsers = (req, res) => {
  userModel.find()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}

exports.loginUser = async (req, res, jwtSettings) => {
  const { username, password } = req.body

  try {
    const user = await userModel.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    // Generate JWT token
    const token = jwt.sign({
      userId: user._id, username: user.username
    }, jwtSettings.secret, { expiresIn: jwtSettings.expires })

    req.session.user = { username: user.username, userId: user._id }

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving session' })
      }
      res.status(200).json({ message: 'Authentication successful', token })
    })
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed' })
  }
}

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error destroying session' })
    }
    res.status(200).json({ message: 'Session destroyed' })
  })
}

exports.getSessionData = (req, res) => {
  req.session.user ?
    res.status(200).json(req.session.user) :
    res.status(404).json({ message: 'No session data found' })
}