require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

//express.json va primero para poder tener aceso al boy de la solicitud
app.use(express.json())

//para que el back muestre el contenido del front
app.use(express.static('dist'))

//crear un token para que morgan registre el cuerpo de la solicitud
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

//guardar los logs en un archivo
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

//usar morgan con el token personalizado para guardar en el archivo los logs
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', { stream: accessLogStream }))

//usar morgan para ver en consola los logs, no se pasan parametros solo el formato de respuesta
app.use(morgan('combined'))

//este solo muestra los datos en un archivo o el de arriba sin el stream si queremos ver el body
//app.use(morgan('combined', { stream: accessLogStream}))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path: ', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

const unknowEndpoint = (request, response) => {
  response.status(400).send({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

//obtener info de la bd
app.get('/info', (request, response) => {
  Person.countDocuments()
    .then(count => {
      response.send(`<p>La agenda telefonica tiene informacion para ${count} personas</p>
                  <p>${new Date()}</p>`)
    })
    .catch(error => {
      console.error('Error al contar los documentos:', error)
      response.status(500).send('Error al contar los documentos')
    })
})

//obtener todos los recursos
app.get('/api/persons', (request, response) => {
  Person.find({}).then( persons => {
    response.json(persons)
  })
})

//obtener un solo resurso por id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      //const id = Number(request.params.id)
      //const person = persons.find(person => person.id === id)
      if(person){
        response.json(person)
      }else{
        response.status(404)
        response.send('El recurso solicitado no existe')
        response.end()
      }
    })
    .catch(error => {
      next(error)
      //console.error(error)
      //response.status(400).send({error: 'malformatted id'})
    })
})

//eliminar recursos
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
      //const id = Number(request.params.id)
      //persons = persons.filter(person => person.id !== id)
    })
    .catch(error => {
      next(error)
      //console.error(error)
      //response.status(400).send({error: 'el recurso no exite'})
    })

})

//const generateId = Math.floor(Math.random() * 100000) + 1;
//crear un nuevo recurso
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name || body.name.trim() === ''){
    return response.status(400).json({ error: 'el nombre es requerido y no puede estar vacio y debe tener minimo 3 caracteres' })
  }

  if(!body.number || body.number.trim() === ''){
    return response.status(400).json({ error: 'el numero es requerido y no puede estar vacio' })
  }

  //const nameExist = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())
  //if(nameExist){
  // return response.status(400).json({error: 'El nombre ya existe en la agenda'})
  //}

  const person = new Person ({
    //id: (generateId),
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
  //persons = persons.concat(person)
  //response.json(person)
})

//actualizar un recurso exitente
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  //const person = {
  //name: body.name,
  //number: body.number,
  //}

  Person.findByIdAndUpdate(request.params.id,{ name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      next(error)
    //console.error(error)
    //response.status(400).send({error: 'no se pudo actualizar'})
    })
})

app.use(unknowEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})