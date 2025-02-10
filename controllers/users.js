// Importa el módulo bcrypt, que es una librería para hacer hashing de contraseñas
const bcrypt = require('bcrypt')

// Importa el enrutador de express para manejar las rutas HTTP
const usersRouter = require('express').Router()

// Importa el modelo de usuario, que representa la colección de usuarios en la base de datos
const User = require('../models/user')


// Define una ruta GET en '/'. Esta ruta se usa para obtener todos los usuarios
usersRouter.get('/', async (request, response) => {
  // Usamos el método Findo para obtener todos los usuarios
  // Se crea una instancia para el modelo User.find
  const users = await User.find({}).populate('notes', { content: 1, important: 1 }) // Método populate para la unión Mongoose entre users y notes -- Mostrando solo los campos content e important
  response.json(users) // El servidor responde con los usuarios en formato json
})

// Define una ruta POST en '/'. Esta ruta se usa para crear un nuevo usuario
usersRouter.post('/', async (request, response) => {
  // Desestructura los campos username, name y password del cuerpo de la solicitud (request.body)
  const { username, name, password } = request.body

  // Define el número de saltos que se usarán para generar el hash (más saltos = más seguro pero más lento)
  const saltRounds = 10

  // Crea un hash de la contraseña usando bcrypt, el cual será almacenado en la base de datos
  // `await` espera que la operación de hash termine antes de continuar
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Crea un nuevo objeto de usuario con los datos proporcionados y el hash de la contraseña
  const user = new User({
    username,
    name,
    passwordHash,  // El campo de la contraseña ahora contiene el hash, no la contraseña en texto claro
  })

  // Guarda el nuevo usuario en la base de datos y espera hasta que el proceso termine
  const savedUser = await user.save()

  // Responde con un status 201 (creado) y devuelve el objeto de usuario guardado en formato JSON
  response.status(201).json(savedUser)
})

// Exporta el enrutador para que pueda ser utilizado en otros archivos
module.exports = usersRouter
