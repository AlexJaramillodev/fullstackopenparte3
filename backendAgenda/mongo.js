const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('porfavor ingrese la contraseña')
  process.exit(1)
}

const password = process.argv[2]
const nombre = process.argv[3]
const telefono = process.argv[4]

const url =  `mongodb+srv://AlexJaramillodev:${password}@cluster0.e6ell.mongodb.net/agendaApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: `${nombre}`,
  number: `${telefono}`
})

if(process.argv.length > 4){
  person.save().then(result => {
    console.log( `agragado ${nombre} telefono ${telefono} a la agenda`)
    mongoose.connection.close()
  })
}


if(process.argv.length ===3){
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
