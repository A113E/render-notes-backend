const http = require('http') // Importa el módulo http
const app = require('./app') // Importa la aplicación Express real
const config = require('./utils/config') // Importa la configuración de la variable de entorno
const logger = require('./utils/logger') // Importa el módulo para las impresiones en la consola

// Crea el servidor HTTP utilizando la aplicación Express
const server = http.createServer(app)

// Escucha en el puerto configurado
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`) // Imprime un mensaje en la consola confirmando que el puerto está corriendo
})

