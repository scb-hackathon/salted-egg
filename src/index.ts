import 'dotenv/config'

import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'

const {PORT} = process.env

export const app = express(feathers())

// Turn on JSON body parsing for REST services
app.use(express.json())

// Turn on URL-encoded body parsing for REST services
app.use(express.urlencoded({ extended: true }))

// Set up REST transport using Express
app.configure(express.rest())

// Set up an error handler that gives us nicer errors
app.use(express.errorHandler())

app.get('/', (_req, res) => {
  res.send({status: 'OK'})
})

app.use('/hello', {
  async find() {
    return "Hello, World!"
  }
})

app.listen(PORT)
