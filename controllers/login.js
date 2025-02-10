// Importamos el módulo 'jsonwebtoken' para generar y verificar tokens JWT
const jwt = require('jsonwebtoken')
// Importa dotenv para conectar con el archivo .env (clave Secreta)
require('dotenv').config()


// Importamos 'bcrypt' para comparar contraseñas cifradas
const bcrypt = require('bcrypt')

// Creamos un nuevo router de Express para manejar las rutas de login
const loginRouter = require('express').Router()

// Importamos el modelo 'User' que representa los usuarios en la base de datos
const User = require('../models/user')

/**
 * Definimos la ruta POST en '/' para manejar el inicio de sesión
 * Esta ruta recibe un 'username' y 'password' en el cuerpo de la petición
 */
loginRouter.post('/', async (request, response) => {
  // Extraemos 'username' y 'password' del cuerpo de la petición (request.body)
  const { username, password } = request.body

  // Buscamos en la base de datos si existe un usuario con el nombre de usuario proporcionado
  const user = await User.findOne({ username })

  // Verificamos si la contraseña ingresada coincide con la almacenada en la base de datos
  // Si el usuario no existe, 'passwordCorrect' será 'false'
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // Si el usuario no existe o la contraseña es incorrecta, devolvemos un error 401 (Unauthorized)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password' // Mensaje de error para el cliente
    })
  }

  // Si las credenciales son correctas, creamos un objeto con la info que irá dentro del token
  const userForToken = {
    username: user.username, // Nombre de usuario
    id: user._id, // ID del usuario en la base de datos
  }

  // Limitar el tiempo del token
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,  // Generamos un token JWT usando la información del usuario y una clave secreta almacenada en 'process.env.SECRET'
    { expiresIn: 60*60 } // el token expira in 60*60 segundos, eso es, en una hora (1 HORA)
  )


  // Enviamos la respuesta al cliente con el token generado y datos del usuario
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

// Exportamos 'loginRouter' para que pueda ser usado en otras partes de la aplicación
module.exports = loginRouter
