import 'dotenv/config'

import {PayService} from 'PayService'

import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {WebhookService} from 'WebhookService'
import {Request, Response} from 'express'
import {FeathersError} from '@feathersjs/errors'

const {PORT} = process.env

export const app = express(feathers())

// Turn on JSON body parsing for REST services
app.use(express.json())

// Turn on URL-encoded body parsing for REST services
app.use(express.urlencoded({ extended: true }))

// Set up REST transport using Express
app.configure(express.rest())

app.get('/', (_req, res) => {
  res.send({status: 'OK Then!'})
})

app.use('/pay', new PayService())
app.use('/webhook', new WebhookService())

app.get('/redirect', (req: Request, res: Response) => {
  console.log('> Redirecting to:', req.query.url)

  res.setHeader('Location', req.query.url)
  res.status(301)
  res.send('<h1>REDIRECT</h1>')
})

// Set up an error handler that gives us nicer errors
app.use(express.errorHandler({
  json(error: FeathersError, _req: Request, res: Response, next: Function) {
    console.error('[!!] Error:', error.code, error.name)

    res.sendStatus(error.code)
    next()
  }
}))

app.listen(PORT)
