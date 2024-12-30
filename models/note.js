// Importa el módulo mongoose, que se utiliza para interactuar con MongoDB.
const mongoose = require('mongoose')

// Configura mongoose para no lanzar advertencias relacionadas con las consultas estrictas en MongoDB.
mongoose.set('strictQuery', false)

// Obtiene la URL de conexión a la base de datos desde las variables de entorno (archivo .env).
const url = process.env.MONGODB_URI

// Muestra en la consola la URL de conexión para asegurar que se está utilizando la correcta.
console.log('connecting to', url)

// Intenta conectar a la base de datos MongoDB utilizando la URL obtenida desde las variables de entorno.
mongoose.connect(url)
  .then(result => {
    // Si la conexión es exitosa, muestra un mensaje indicando que se ha conectado correctamente.
    console.log('connected to MongoDB')
  })
  .catch(error => {
    // Si ocurre un error al intentar conectar, muestra un mensaje de error con el mensaje específico.
    console.log('error connecting to MongoDB:', error.message)
  })

// Define el esquema para las "notas" en la base de datos MongoDB.
const noteSchema = new mongoose.Schema({
  content: String,   // Campo de tipo cadena que almacena el contenido de la nota.
  date: Date,        // Campo de tipo fecha que almacena la fecha de la nota.
  important: Boolean,// Campo de tipo booleano que indica si la nota es importante o no.
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

