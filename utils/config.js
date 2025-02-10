// Importar el archivo .env del dotenv *IMPORTANTE PONER PRIMERO QUE EL MODULO NOTE*
require('dotenv').config()
const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// Exportar modulo
module.exports = {
  MONGODB_URI,
  PORT
}