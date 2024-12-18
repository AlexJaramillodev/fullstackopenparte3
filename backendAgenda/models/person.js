const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('conectado a', url)

mongoose
  .connect(url)
  .then((result) => {
    console.log('conectado a Mongodb')
  })
  .catch((error) => {
    console.log('error conectando a Mongodb:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (valuenumber){
        return /^\d{2,3}-\d{8,}$/.test(valuenumber)
      },
      message: props => `${props.value} no es un numero de telefono valido`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)