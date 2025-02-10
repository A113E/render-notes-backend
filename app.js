// Importación de Módulos
const config = require('./utils/config') // Importa las configuraciones de la aplicación, incluyendo variables de entorno como MONGODB_URI (la URI para conectar a MongoDB).
const express = require('express') // Importa el framework Express para manejar solicitudes HTTP y definir rutas.
require('express-async-errors') // Librería para quitar el try-catch
const app = express() // Crea una instancia de la aplicación Express.
const cors = require('cors') // Importa el middleware CORS para permitir solicitudes desde diferentes dominios.
const notesRouter = require('./controllers/notes') // Importa un enrutador que contiene las rutas para manejar operaciones relacionadas con las "notas".
const usersRouter = require('./controllers/users') // Importa un enrutador que contiene las rutas para manejar operaciones relacionadas con los "usuarios".
const loginRouter = require('./controllers/login') // Importa un enrutador que contiene las rutas para manejar operaciones relacionadas con el "logueo".
const middleware = require('./utils/middleware') // Importa middlewares personalizados como requestLogger, unknownEndpoint, y errorHandler.
const logger = require('./utils/logger') // Importa un módulo para manejar mensajes de registro (logs) en la consola.
const mongoose = require('mongoose') // Importa el ODM de Mongoose para interactuar con la base de datos MongoDB.

// Configuración de Mongoose
mongoose.set('strictQuery', false) // Configura Mongoose para no aplicar restricciones estrictas en las consultas

// Conexión a MongoDB
logger.info('connecting to', config.MONGODB_URI) // Imprime un mensaje en la consola indicando que se está intentando conectar a MongoDB.

// Intenta establecer una conexión con la base de datos MongoDB usando la URI proporcionada en las variables de entorno.
mongoose.connect(config.MONGODB_URI)
  .then(() => { // Si la conexión es exitosa, se imprime un mensaje indicando que la conexión fue establecida.
    logger.info('connected to MongoDB')
  })
  .catch((error) => { // Si ocurre un error durante la conexión, se registra el error con un mensaje indicando el fallo.
    logger.error('error connecting to MongoDB:', error.message)
  })

// Middlewares globales
app.use(cors()) // Permite que tu servidor acepte solicitudes desde otros dominios (Es necesario para aplicaciones frontend y backend que no están en el mismo dominio)
app.use(express.static('dist')) // Sirve archivos estáticos desde la carpeta dist (por ejemplo, un frontend construido con React).
app.use(express.json()) // Habilita el soporte para analizar cuerpos de solicitudes con formato JSON. Esto es necesario para manejar datos enviados en solicitudes POST y PUT.
app.use(middleware.requestLogger) // Aplica un middleware personalizado que registra información sobre cada solicitud HTTP (método, ruta, cuerpo, etc.).
app.use(middleware.tokenExtractor) // Aplica un middleware para extraer el token

// Montaje del enrutador
// Monta el enrutador notesRouter en la ruta base /api/notes
app.use('/api/notes', notesRouter) // Esto significa que todas las rutas definidas en notesRouter estarán disponibles bajo el prefijo /api/notes.
// Monta el enrutador usersRouter en la ruta /api/users
app.use('/api/users', usersRouter) // Esto significa que todas las rutas definidas en usersRouter estarán disponibles bajo el prefijo /api/users
// Monta el enrutador loginRouter en la ruta /api/login
app.use('/api/login', loginRouter) // Esto siginifica que todas las rutas definidas en loginRouter estarán disponibles bajo el prefijo /api/login

// Middlewares para manejar errores
app.use(middleware.unknownEndpoint) // Maneja solicitudes a rutas no definidas en el servidor.(Responde con un error 404 Not Found)
app.use(middleware.errorHandler) // Middleware para manejar errores en la aplicación (Intercepta errores generados en rutas o middlewares anteriores y responde con un mensaje de error adecuado.)

// Exportación de la aplicación
module.exports = app

