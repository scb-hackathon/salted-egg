import 'dotenv/config'

import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'

export const app = express(feathers())

// Turn on JSON body parsing for REST services
app.use(express.json())

// Turn on URL-encoded body parsing for REST services
app.use(express.urlencoded({ extended: true }))

// Set up REST transport using Express
app.configure(express.rest())

// Set up an error handler that gives us nicer errors
app.use(express.errorHandler())

app.use('/hello', {
  async find() {
    return "Hello, World!"
  }
})

app.listen(3030)
