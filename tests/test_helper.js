// Importa el modelo 'Note' desde el archivo '../models/note'
// Este modelo define la estructura de los documentos en la colección correspondiente en MongoDB (Note).
const Note = require('../models/note')
// Este modelo define la estructura de los documentos en la colección correspondiente en MongoDB (User).
const User = require('../models/user')

// Define un arreglo inicial llamado 'initialNotes' con dos objetos.
// Cada objeto representa una nota con dos propiedades: 'content' (el contenido de la nota)
// e 'important' (si la nota es importante o no).
const initialNotes = [
  {
    content: 'HTML is easy',  // Contenido de la primera nota.
    important: false          // Indica que la nota no es importante.
  },
  {
    content: 'Browser can execute only JavaScript',  // Contenido de la segunda nota.
    important: true                                  // Indica que la nota es importante.
  }
]

// Define una función asíncrona 'nonExistingId' que crea un ID válido de MongoDB
// para una nota que no existirá en la base de datos.
// Esto es útil para pruebas que requieran un ID válido pero no asociado a ningún documento.
const nonExistingId = async () => {
  // Crea una nueva instancia del modelo 'Note' con un contenido específico.
  const note = new Note({ content: 'willremovethissoon' })

  // Guarda la nota temporalmente en la base de datos.
  await note.save()

  // Elimina la nota inmediatamente después de guardarla.
  await note.deleteOne()

  // Devuelve el ID de la nota como una cadena.
  // Este ID ahora es válido pero no está asociado a ningún documento en la base de datos.
  return note._id.toString()
}

// Define una función asíncrona 'notesInDb' que recupera todas las notas
// actualmente almacenadas en la base de datos.
const notesInDb = async () => {
  // Busca todos los documentos en la colección asociada al modelo 'Note'.
  const notes = await Note.find({})

  // Mapea los documentos encontrados y los transforma a su representación JSON.
  // Esto asegura que los datos se devuelvan en un formato legible.
  return notes.map(note => note.toJSON())
}

// Función para buscar todos los usuarios y convertirlos en formato JSON
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

// Exporta las constantes y funciones definidas para que puedan ser utilizadas
// en otros archivos que importen este módulo.
// 'initialNotes' se utiliza como datos iniciales para pruebas.
// 'nonExistingId' genera un ID de prueba que no tiene correspondencia en la base de datos.
// 'notesInDb' devuelve las notas almacenadas en la base de datos.
module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
