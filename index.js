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



// Endpoint para agregar una nueva nota.
// Define una ruta POST en el servidor para manejar solicitudes en '/api/notes'.
app.post('/api/notes', (request, response) => {
  // Extrae el cuerpo de la solicitud (el contenido enviado por el cliente).
  const body = request.body;

  // Verifica si 'content' no está presente en el cuerpo de la solicitud.
  // Si falta, responde con un código de estado 400 (Bad Request) y un mensaje de error.
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' });
  }

  // Crea una nueva instancia del modelo 'Note' con los datos proporcionados.
  // - 'content': Toma el contenido enviado en la solicitud.
  // - 'date': Usa la fecha enviada en la solicitud o genera la fecha actual si no se proporciona.
  // - 'important': Usa el valor enviado o, si no se proporciona, lo establece en 'false' por defecto.
  const note = new Note({
    content: body.content,
    date: body.date || new Date(),
    important: body.important || false,
  });

  // Intenta guardar la nueva nota en la base de datos.
  note
    .save()
    .then((savedNote) => {
      // Si se guarda con éxito, responde con el objeto de la nota guardada.
      response.json(savedNote);
    })
    .catch((error) => {
      // Si ocurre un error durante el guardado, responde con un código de estado 500 (Error interno del servidor).
      response.status(500).json({ error: 'error saving note' });
    });
});


// Endpoint para obtener una nota específica por su ID.
// Define una ruta GET en el servidor para manejar solicitudes en '/api/notes/:id'.
// ':id' es un parámetro dinámico que permite capturar un identificador único (id).
app.get('/api/notes/:id', (request, response) => {
  // Usa el modelo 'Note' para buscar una nota en la base de datos por su 'id'.
  // El 'id' se obtiene de los parámetros de la URL mediante 'request.params.id'.
  Note.findById(request.params.id).then((note) => { // Método findById de Mongoose
    // Si se encuentra una nota con el 'id' especificado, responde con ella en formato JSON.
    response.json(note);
  });
});


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

