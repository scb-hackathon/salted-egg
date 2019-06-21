import 'dotenv/config'

import {PayService} from 'PayService'

import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {WebhookService} from 'WebhookService'
import {Request, Response} from 'express'
import {FeathersError} from '@feathersjs/errors'
import {PaymentRedirectHTML} from 'PaymentRedirectHTML.ts'

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
  const {url} = req.query
  const decoded = Buffer.from(url, 'base64').toString('binary');
  console.log('> Redirecting to Decoded URL =', decoded)

  // res.setHeader('Location', decoded)
  // res.status(302)
  res.send(PaymentRedirectHTML.replace('{{DECODED}}', decoded))
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
