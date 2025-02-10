// Importa el modulo Mongoose para interactuar con la base de datos
const mongoose = require('mongoose')

// Esquema para los usuarios
const userSchema = new mongoose.Schema({
  // Campos del esquema
  username: {
    type: String,
    minLength: 4,
    maxLength: 18,
    required: true,
    unique: true // esto asegura la unicidad de username
  },
  name: String,
  passwordHash: String,
  // Matriz ID con los identificadores de usuarios
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

// Configura cómo se debe transformar el usuario cuando se convierta a formato JSON (por ejemplo, al enviarla a través de una API).
userSchema.set('toJson', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // el passwordHash no debe mostrarse
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User