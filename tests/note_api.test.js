// Importamos las funciones necesarias de node:test para definir las pruebas
const { test, after, beforeEach, describe } = require('node:test')

// Importamos el módulo assert para realizar verificaciones en las pruebas
const assert = require('node:assert')

// Importamos mongoose para manejar la base de datos MongoDB
const mongoose = require('mongoose')

// Importamos supertest para hacer solicitudes HTTP a nuestra API durante las pruebas
const supertest = require('supertest')

// Importamos nuestra aplicación Express
const app = require('../app')

// Creamos una instancia de supertest para hacer peticiones a la API
const api = supertest(app)

// Importamos bcrypt para el manejo de contraseñas (hashing)
const bcrypt = require('bcrypt')

// Importamos el módulo 'jsonwebtoken' para generar y verificar tokens JWT
const jwt = require('jsonwebtoken')

// Importamos un archivo helper que contiene funciones auxiliares para las pruebas
const helper = require('./test_helper')

// Importamos los modelos de la base de datos
const User = require('../models/user')
const Note = require('../models/note')

 // Define una variable global para el token
let token = ''
// Bloque de pruebas para las notas
describe('when there is initially some notes saved', () => {
   

  // Antes de cada prueba, eliminamos todas las notas y agregamos algunas iniciales
  beforeEach(async () => {
    await Note.deleteMany({}) // Eliminamos todas las notas de la base de datos
    await Note.insertMany(helper.initialNotes) // Insertamos notas predefinidas

    // Crea un nuevo usuario para autenticarse
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  // Obtén el token de autenticación para futuras pruebas
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
  token = loginResponse.body.token

  })

  // Prueba: la API devuelve las notas en formato JSON
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes') // Hacemos una petición GET a /api/notes
      .expect(200) // Esperamos un código de respuesta 200 (OK)
      .expect('Content-Type', /application\/json/) // Verificamos que la respuesta sea JSON
  })

  // Prueba: todas las notas son devueltas
  test('all notes are returned', async () => {
    const response = await api.get('/api/notes') // Obtenemos todas las notas
    assert.strictEqual(response.body.length, helper.initialNotes.length) // Comparamos el número de notas con las iniciales
  })

  // Prueba: una nota específica está dentro de las notas devueltas
  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes') // Obtenemos todas las notas
    const contents = response.body.map(r => r.content) // Extraemos el contenido de cada nota
    assert(contents.includes('Browser can execute only JavaScript')) // Verificamos si la nota específica está presente
  })

  // Bloque de pruebas para visualizar una nota específica
  describe('viewing a specific note', () => {

    // Prueba: ver una nota específica con un ID válido
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb() // Obtenemos las notas actuales
      const noteToView = notesAtStart[0] // Seleccionamos la primera nota

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`) // Hacemos una petición GET con el ID de la nota
        .expect(200) // Esperamos un código de respuesta 200
        .expect('Content-Type', /application\/json/) // Verificamos que la respuesta sea JSON

      assert.deepStrictEqual(resultNote.body, noteToView) // Comparamos la nota obtenida con la original
    })

    // Prueba: falla con código 404 si la nota no existe
    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId() // Obtenemos un ID válido pero inexistente

      await api
        .get(`/api/notes/${validNonexistingId}`) // Intentamos obtener la nota
        .expect(404) // Esperamos un código de respuesta 404 (Not Found)
    })

    // Prueba: falla con código 400 si el ID es inválido
    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445' // ID inválido

      await api
        .get(`/api/notes/${invalidId}`) // Intentamos obtener la nota
        .expect(400) // Esperamos un código de respuesta 400 (Bad Request)
    })
  })

  // Bloque de pruebas para la adición de nuevas notas
  describe('addition of a new note', () => {

    // Prueba: se puede añadir una nota válida
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes') // Hacemos una petición POST para crear una nueva nota
        .set('Authorization', `Bearer ${token}`) // Usa el token en los encabezados
        .send(newNote) // Enviamos la nueva nota en el cuerpo de la petición
        .expect(201) // Esperamos un código de respuesta 201 (Created)
        .expect('Content-Type', /application\/json/) // Verificamos que la respuesta sea JSON

      const notesAtEnd = await helper.notesInDb() // Obtenemos las notas actuales
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1) // Verificamos que la cantidad de notas haya aumentado

      const contents = notesAtEnd.map(n => n.content) // Extraemos el contenido de cada nota
      assert(contents.includes('async/await simplifies making async calls')) // Verificamos que la nueva nota fue añadida
    })

    // Prueba: falla con código 400 si los datos son inválidos
    test('fails with status code 400 if data invalid', async () => {
      const newNote = {
        important: true // Falta el contenido
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400) // Esperamos un código de error 400

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length) // La cantidad de notas no debe cambiar
    })
  })

  // Bloque de pruebas para la eliminación de notas
  describe('deletion of a note', () => {
    // Prueba: eliminar una nota con un ID válido
    test('succeeds with status code 204 if id is valid', async () => {
      let token = null

  const passwordHash = await bcrypt.hash('12345', 10)
  const user = await new User({ username: 'name', passwordHash }).save()

  const userForToken = { username: 'name', id: user.id }
  token = jwt.sign(userForToken, process.env.SECRET)

  const newNote = {
   content: "Deleted Note",
   important: true
  }

  await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  return token
  })
})

// Bloque de pruebas para la gestión de usuarios
describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({}) // Eliminamos todos los usuarios

    const passwordHash = await bcrypt.hash('sekret', 10) // Hasheamos una contraseña
    const user = new User({ username: 'root', passwordHash }) // Creamos un usuario inicial

    await user.save() // Guardamos el usuario en la base de datos
  })

  // Prueba: creación de un nuevo usuario con un nombre único
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })
})

// Después de todas las pruebas, eliminamos los usuarios y cerramos la conexión a la base de datos
after(async () => {
  await mongoose.connection.close()
})

