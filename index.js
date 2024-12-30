//  Importar el archivo .env del dotenv *IMPORTANTE PONER PRIMERO QUE EL MODULO NOTE*
require('dotenv').config()
// Importa el módulo Express, que se utiliza para crear aplicaciones web en Node.js.
const express = require('express')
// Crea una instancia de la aplicación Express.
const app = express()
// Crea una instancia para importar el modelo de Mongoose
const Note = require('./models/note')




// Middleware para servir archivos estáticos desde la carpeta "dist".
app.use(express.static('dist'))

// Middleware para registrar información sobre cada solicitud al servidor.
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method) // Muestra el método HTTP (GET, POST, etc.).
  console.log('Path:  ', request.path)   // Muestra la ruta de la solicitud.
  console.log('Body:  ', request.body)   // Muestra el cuerpo de la solicitud.
  console.log('---')
  next() // Pasa el control al siguiente middleware.
}

// Importa el módulo CORS, que permite solicitudes de diferentes orígenes.
const cors = require('cors')

// Habilita el soporte para solicitudes desde otros dominios.
app.use(cors())

// Middleware para analizar datos JSON en las solicitudes entrantes.
app.use(express.json())
// Aplica el middleware de registro de solicitudes.
app.use(requestLogger)

// Middleware para manejar solicitudes a endpoints desconocidos.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' }) // Devuelve un error 404 si la ruta no existe.
}

// Endpoint para la raíz del servidor, devuelve un mensaje "Hello World!".
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Endpoint para obtener todas las notas.
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes =>{ // Obtiene las notas desde Mongo.js
  response.json(notes) // Responde con la lista de notas en formato JSON.
})
.catch((error) => next(error));
});

// Función para generar un nuevo ID único para una nota.
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) // Encuentra el ID más alto en las notas existentes.
    : 0
  return maxId + 1 // El nuevo ID será el mayor existente más uno.
}

// Endpoint para agregar una nueva nota.
app.post('/api/notes', (request, response) => {
  const body = request.body // Obtiene el cuerpo de la solicitud.

  if (!body.content) {
    // Si falta el contenido, responde con un error 400 (solicitud inválida).
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  // Crea una nueva nota con el contenido recibido y un ID generado.
  const note = {
    content: body.content,
    important: body.important || false, // Si no se especifica, `important` será falso.
    id: generateId(),
  }

  // Agrega la nueva nota a la lista existente.
  notes = notes.concat(note)

  // Responde con la nueva nota en formato JSON.
  response.json(note)
})

// Endpoint para obtener una nota específica por su ID.
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) // Convierte el ID recibido a un número.
  const note = notes.find(note => note.id === id) // Busca la nota con el ID especificado.
  if (note) {
    response.json(note) // Si se encuentra, responde con la nota.
  } else {
    response.status(404).end() // Si no se encuentra, responde con un error 404.
  }
})

// Endpoint para eliminar una nota por su ID.
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) // Convierte el ID recibido a un número.
  // Filtra la lista de notas para eliminar la nota con el ID especificado.
  notes = notes.filter(note => note.id !== id)

  response.status(204).end() // Responde con un estado 204 (sin contenido).
})

// Aplica el middleware para manejar endpoints desconocidos.
app.use(unknownEndpoint)

// Define el puerto en el que se ejecutará el servidor.
const PORT = process.env.PORT
// Inicia el servidor y muestra un mensaje indicando el puerto.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

