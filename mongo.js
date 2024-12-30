// Importa el módulo 'mongoose' para interactuar con MongoDB.
const mongoose = require('mongoose');

// Comprueba si el programa fue ejecutado con al menos 3 argumentos (node, archivo, password).
if (process.argv.length < 3) {
  console.log(`Usage: node mongo.js <password> [content] [date] [important]`); // Muestra un mensaje de error si falta la contraseña.
  process.exit(1); // Finaliza el programa con un código de error.
}

// Obtiene el tercer argumento de la línea de comandos, que es la contraseña para MongoDB.
const password = process.argv[2];
// Obtiene el argumento content
const content = process.argv[3];
// Obtiene el argumento important
const important = process.argv[4];


// Construye la URL de conexión a MongoDB usando la contraseña proporcionada.
const url = 
  `mongodb+srv://fullstack:${password}@cluster0.ysntw.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

// Configura mongoose para que no use el modo estricto de consulta (opcional, depende del uso que desees).
mongoose.set('strictQuery', false);

// Establece la conexión con la base de datos en la URL proporcionada.
mongoose.connect(url);

// Define un esquema para los documentos de la colección 'notes'.
// El esquema especifica que cada nota tiene un contenido ('content') y una bandera de importancia ('important').
const noteSchema = new mongoose.Schema({
  content: String, // El campo 'content' será de tipo String.
  date: Date, // El campo será tipo Fecha
  important: Boolean, // El campo 'important' será de tipo Boolean.
});

// Crea un modelo llamado 'Note' basado en el esquema 'noteSchema'.
// Este modelo representa la colección 'notes' en la base de datos.
const Note = mongoose.model('Note', noteSchema);

// Crea un modelo basado en el esquema definido
// El modelo se usará para interactuar con la colección en la base de datos
if (!content && !important) {
  // Si no se pasa un nombre ni un teléfono, muestra todas las entradas de la agenda
  Note.find({})
  .then((result) =>{
    console.log(`Notes`);
    result.forEach(note =>{
      console.log(note); 
    });
    // Cierra la conexión
    mongoose.connection.close();
  });
  // Condicion si se agrega una nueva nota
} else if (content && important) {
  // Crea una nueva nota
  const note = new Note({
    content: content,
    date: new Date(), // Genera la fecha actual automáticamente.
    important: important,
  });
  // Guarda la nota
  note.save()
  .then(() =>{
    // Imprime un mensaje confirmando la nota
    console.log(`Added to notes: ${content} with ${important}`);
    // Cierra la conexión
    mongoose.connection.close();
  })
  // Manejo de errores
  .catch(error =>{
    // Imprime un mensaje de error
    console.log(`Error saving note:`. error);
    // Cierra la conexión
    mongoose.connection.close();
  })
  // Condicion si no se agrega datos
} else {
  // Imprime un mensaje
  console.log(`Please provide both content and important to add a new note.`);
  // Cierra la conexión
  mongoose.connection.close();
}

