// Importa el módulo mongoose, que se utiliza para interactuar con MongoDB.
const mongoose = require('mongoose')


// Define el esquema para las "notas" en la base de datos MongoDB.
const noteSchema = new mongoose.Schema({
  // Campo de tipo cadena que almacena el contenido de la nota.
  content: { // Reglas de validación
    type: String, // Tipo de docuemnto Cadena
    minLength: 5, // Mínimo 5 caracteres de longitud
    required: true // Es obligatorio ponerlo
  },
  date: Date,        // Campo de tipo fecha que almacena la fecha de la nota.
  important: Boolean,// Campo de tipo booleano que indica si la nota es importante o no.
  // Matriz ID con los identificadores de usuario
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Configura cómo se debe transformar la nota cuando se convierta a formato JSON (por ejemplo, al enviarla a través de una API).
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Crea un campo "id" a partir del "_id" de MongoDB (que es un objeto) y lo convierte a una cadena.
    returnedObject.id = returnedObject._id.toString()

    // Elimina el campo "_id" original, ya que no es necesario en la respuesta.
    delete returnedObject._id

    // Elimina el campo "__v" que es usado por Mongoose para versiones internas del documento.
    delete returnedObject.__v
  }
})

// Exporta el modelo "Note", que se basa en el esquema noteSchema, para que pueda ser utilizado en otras partes de la aplicación.
module.exports = mongoose.model('Note', noteSchema)

