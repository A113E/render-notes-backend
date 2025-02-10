import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticPluginJs from "@stylistic/eslint-plugin-js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules/**', 'dist/**'], // Agrega las rutas a los archivos o carpetas que quieres ignorar
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node, // Run código (node o navegador(browser))
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      "@stylistic/js": stylisticPluginJs, // Habilita el Plugin
    },
    rules: { // Reglas d eestilo
      "@stylistic/js/indent": ["error", 2], // Indentación de 2 espacios
      "@stylistic/js/linebreak-style": ["error", "unix"], // Estilo de saltos de línea
      "@stylistic/js/quotes": ["error", "single"], // Comillas simples
      "@stylistic/js/semi": ["error", "never"], // Sin punto y coma
      "eqeqeq": "error", // Nos alerta si la igualdad se verifica con algo que no sea el operador de triple igual
      "no-trailing-spaces":"error", // Prohíbe espacios en blanco al final de las líneas de código
      "object-curly-spacing": ["error", "always"], // Exige que haya espacios dentro de las llaves de los objetos
      "arrow-spacing": ["error", {"before": true, "after": true}], // Requiere que haya un espacio antes y después de la flecha (=>) en las funciones de flecha.
      "no-console": 0 // Desactiva la advertencia o error relacionado con el uso de console.log() y similares

    },
  },
];
