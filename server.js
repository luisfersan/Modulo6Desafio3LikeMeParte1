// Importo el módulo Express (Framework web para Node.js). Almaceno require('express') en la constante "express" para usar express más adelante: crear una aplicación Express, definir rutas y configurar middleware (software con el que las diferentes aplicaciones se comunican entre sí).
const express = require('express')

// Importo el paquete CORS (Cross-Origin Resource Sharing). Al almacenar require('cors') en la constante cors, puedo usarlo como middleware en mi aplicación Express para permitir o restringir solicitudes entre diferentes dominios.
const cors = require('cors')

// Importo el objeto Pool del paquete pg, que es un cliente de PostgreSQL para Node.js. Al usar const { Pool } = require('pg'), puedo crear una instancia de Pool que se conectará a mi BDD PostgreSQL.
const { Pool } = require('pg')

// Creo la aplicación Express
const app = express()
const port = 3000

// Middleware
app.use(cors()) // Habilito CORS
app.use(express.json()) // Habilito el manejo de JSON en el cuerpo de las peticiones.

// Realizo la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres', // Este es mi usuario de PostgreSQL
  host: '127.0.0.1', // Este es mi servidor de la BDD
  database: 'likeme', // Este es el nNombre de la BDD
  password: 'admin1234', // Esta es la contraseña de mi PostgreSQL
  port: 5432, // Este es el puerto por defecto de PostgreSQL
})

// Creo la ruta GET para obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts')
    res.json(result.rows) // Devuelvo los posts como JSON
  } catch (error) {
    console.error(error)
    res.status(500).send('Error en el servidor')
  }
})

// Creo la ruta POST para agregar un nuevo post
app.post('/posts', async (req, res) => {
  const { titulo, url, descripcion } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *',
      [titulo, url, descripcion]
    )
    res.status(201).json(result.rows[0]) // Devuelvo el nuevo post creado
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al agregar el post')
  }
})

// Inicio el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
