const mongoose = require('mongoose')

// Comprueba si se proporciona la contraseña como argumento.
if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password>') // Mensaje si falta la contraseña
  process.exit(1) // Finaliza el programa con un código de error
}

// Obtiene la contraseña de la línea de comandos
const password = process.argv[2]

// Construye la URL de conexión a MongoDB usando la contraseña proporcionada
const url = `mongodb+srv://fullstack:${password}@cluster0.ysntw.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

// Configura mongoose para no usar el modo estricto de consulta
mongoose.set('strictQuery', false)

// Conecta a la base de datos
mongoose.connect(url)

// Define el esquema para las notas
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

// Crea el modelo Note basado en el esquema
const Note = mongoose.model('Note', noteSchema)

// Define las dos notas predeterminadas
const notes = [
  { content: 'HTML is easy', date: new Date(), important: true },
  { content: 'Browser can execute only JavaScript', date: new Date(), important: false },
]

// Elimina todas las notas existentes y agrega las nuevas
const seedNotes = async () => {
  try {
    await Note.deleteMany({}) // Borra todas las notas en la colección
    console.log('Database cleared!')

    const result = await Note.insertMany(notes) // Inserta las notas predeterminadas
    console.log('Added notes:', result)

    mongoose.connection.close() // Cierra la conexión
  } catch (error) {
    console.error('Error seeding notes:', error)
    mongoose.connection.close() // Cierra la conexión en caso de error
  }
}

// Ejecuta la función para inicializar la base de datos
seedNotes()


