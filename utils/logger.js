// Módulo para las las impresiones a la consola
// Creamos una instancia para todos los tipos de impresiones
const logger = {
  info: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${message}`) // Salida informativa
    }
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[DEBUG] ${message}`) // Salida de depuración
    }
  },
  warn: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[WARN] ${message}`) // Advertencias
    }
  },
  error: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[ERROR] ${message}`) // Errores
    }
  },
}

module.exports = logger
