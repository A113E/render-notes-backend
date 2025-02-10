// CONTROLADORES DE RUTA
// Creamos una instancia para importar la función Router de Express
const notesRouter = require('express').Router()
// Importamos el modelo Note
const Note = require('../models/note')
// Importamos el modelo User
const User = require('../models/user')
// Importamos el módulo 'jsonwebtoken' para generar y verificar tokens JWT
const jwt = require('jsonwebtoken')
// Importamos el modulo Middleware
const middleware = require('../utils/middleware')




// Ruta Asincrónica para obtener todas las notas
notesRouter.get('/', async (request, response) => {
  // Usamos el método find para obtener las notas d ela base de datos
  // Se crea una instancia para el modelo Note.find
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 }) // Método populate para la unión Mongoose entre users y notes -- Mostrando solo los campos username y name
  response.json(notes) // El servidor responde con las notas en formato json
})



// Ruta para buscar una nota por su ID
notesRouter.get('/:id', async (request, response) => {
  // Usamos el método findById para obtener una nota por su ID
  const note = await Note.findById(request.params.id) // El 'id' se obtiene de los parámetros de la URL mediante 'request.params.id'
  if (note) {
    response.json(note) // Si se encuentra una nota con el 'id' especificado, responde con ella en formato JSON.
  } else { // Si no la encuentra responde
    response.status(404).end() // Estatus No se encontró NO FOUND
  }
})


// Ruta para crear una nueva nota (método HTTP POST)
notesRouter.post('/', middleware.userExtractor, async (request, response) => {

  // Extraemos el cuerpo de la solicitud, donde vienen los datos de la nueva nota
  const body = request.body

  const user = request.user // Usuario ya extraído por el middleware

  // Creamos una nueva nota con los datos recibidos y asignamos el usuario que la creó
  const note = new Note({
    content: body.content, // Contenido de la nota
    important: body.important === undefined ? false : body.important, // Si no se define, será false por defecto
    user: user._id // Se guarda la referencia del usuario en la nota
  })

  // Guardamos la nota en la base de datos
  const savedNote = await note.save()

  // Agregamos la nueva nota al usuario y guardamos los cambios en su perfil
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  // Respondemos con la nota creada en formato JSON
  response.json(savedNote)
})



// Ruta para eliminar una nota por su ID
notesRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user // Usuario ya extraído por el middleware
  
  const note = await Note.findById(request.params.id)
  if(!note) {
    return response.status(404).json({ error: 'note not found' })
  }
  if (note.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'permission denied' })
  }
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})



// Ruta para actualizar la importancia de la nota
notesRouter.put('/:id', async (request, response) => {
  // Contiene el cuerpo de la solicitud enviada por el cliente (en formato JSON).
  const { content, important } = request.body // Extraemos los campos del cuerpo
  // Usamos el Método findByIdAndUpdate para actualizar la nota por su ID
  const updatedNote = await Note.findByIdAndUpdate(request.params.id,
    { content, important }, // Usamos las propiedades del cuerpo (body)
    {
      new: true, // Indica que queremos el documento actualizado como resultado.
      runValidators: true, // Habilita las validaciones definidas en el modelo de Mongoose
      context: 'query' // Asegura que las validaciones funcionen correctamente en operaciones de actualización.
    }
  )
  // Maneja la resolución exitosa de la promesa.
  response.json(updatedNote) //Responde al cliente con el documento actualizado en formato JSON.
})



// Exportar el modulo
module.exports = notesRouter