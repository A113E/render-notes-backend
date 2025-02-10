// Importación del módulo logger
const User = require('../models/user')
const logger = require('./logger')
// Importamos el módulo 'jsonwebtoken' para generar y verificar tokens JWT
const jwt = require('jsonwebtoken')

// Middleware: requestLogger
const requestLogger = (request, response, next) => {
  // Registra información sobre cada solicitud HTTP que llega al servidor
  logger.info('Method:', request.method) // El método HTTP (por ejemplo, GET, POST).
  logger.info('Path:  ', request.path) // La ruta de la solicitud (por ejemplo, /api/notes).
  logger.info('Body:  ', request.body) // El cuerpo de la solicitud, si existe (útil en solicitudes POST o PUT).
  logger.info('---') // Marca el final del registro para separar solicitudes.
  next() // Llama a la siguiente función en el pipeline de middlewares
}

// Middleware: unknownEndpoint
const unknownEndpoint = (request, response) => { // Maneja solicitudes que llegan a rutas no definidas en el servidor
  response.status(404).send({ error: 'unknown endpoint' }) // send({ error: 'unknown endpoint' }): Un mensaje JSON explicando el error.
}

// Middleware: errorHandler
const errorHandler = (error, request, response, next) => { // Maneja errores que ocurren en el servidor y los registra
  logger.error(error.message) // Registra el mensaje del error

  if (error.name === 'CastError') { // Ocurre si se pasa un ID inválido (malformateado) en una consulta a la base de datos.
    return response.status(400).send({ error: 'malformatted id' }) // Devuelve un estado 400 (Solicitud incorrecta) con un mensaje JSON.
  } else if (error.name === 'ValidationError') { // Ocurre cuando un modelo de Mongoose no pasa las validaciones definidas en el esquema.
    return response.status(400).json({ error: error.message }) // Devuelve un estado 400 con el mensaje de error
  } else if (error.name === 'MongoServerError' && error.message.include('E11000 duplicate key error')) { // Ocurre cuando hay un duplicado en el username del usuario
    return response.status(400).json({ error: 'expected `username` to be unique' }) // Devuelve un estado 400 con el mensaje de error
  } else if (error.name === 'JsonWebTokenError') { // Ocurre cuando el token es invalido o está ausente
    return response.status(401).json({ error: 'token invalid' }) // Devuelve el estado 401 No Autorizado
  } else if (error.name === 'TokenExpiredError') { // Ocurre cuando expira el token del usuario
    return response.status(401).json({ error: 'token expired'}) // Devuelve el estado 401 No Autorizado
  }

  next(error) // Si el error no es manejado por los casos anteriores, lo pasa al siguiente middleware de manejo de errores.
}

// Middleware: tokenExtractor
const tokenExtractor = (request, response, next) => {
  // Extrae el token de autorización de las cabeceras de la solicitud.
  const authorization = request.get('authorization')
  // Verifica si el token de autorización está presente y si empieza con 'Bearer '
  if (authorization && authorization.startsWith('Bearer ')) {
      // Si es así, extrae el token y lo asigna a la propiedad 'token' de la solicitud.
      request.token = authorization.replace('Bearer ', '')
  } else {
    // Si no se encuentra un token válido, asigna null a la propiedad 'token'.
    request.token = null
  }
   // Pasa el control al siguiente middleware o función.
   next()
}

// Middleware: userExtractor
const userExtractor = async (request, response, next) => {
   // Verificar que el token esté presente
   if (!request.token) {
    return response.status(401).json({error: 'token missing'})
   }
   // Decodificar el token y obtener el ID del usuario
   const decodedToken = jwt.verify(request.token, process.env.SECRET)
   // Verificar si el token es válido
   if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
   }
   // Buscamos en la base de datos al usuario que creó el token
   const user = await User.findById(decodedToken.id)
   // Si no se encuentra
   if (!user) {
    return response.status(404).json({error: 'User not found'})
   }
   request.user = user
   next()
}

// Exportación de los middlewares
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}