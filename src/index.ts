import 'dotenv/config'

import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {WebhookService} from 'services/WebhookService'
import {Request, Response} from 'express'
import {FeathersError} from '@feathersjs/errors'
import {PayRoute} from 'services/PayService'
import {DeepCallbackRoute} from 'services/DeepCallback'
import {RedirectRoute} from 'services/DeepRedirect'

const {PORT} = process.env

export const app = express(feathers())

// Turn on JSON body parsing for REST services
app.use(express.json())

// Turn on URL-encoded body parsing for REST services
app.use(express.urlencoded({ extended: true }))

// Set up REST transport using Express
app.configure(express.rest())

const ProductListRoute = async (_req: Request, res: Response) =>
  res.send(ProductListHTML)

const IndexRoute = async (_req: Request, res: Response) =>
  res.send({status: 'OK!'})

app.use('/webhook', new WebhookService())
app.get('/', IndexRoute)
app.get('/:account/:number', PayRoute)
app.get('/redirect', RedirectRoute)
app.get('/product_list', ProductListRoute)
app.get('/pay/:account/:number', PayRoute)
app.get('/deep_callback', DeepCallbackRoute)

// Set up an error handler that gives us nicer errors
app.use(express.errorHandler({
  json(error: FeathersError, _req: Request, res: Response, next: Function) {
    console.error('[🔥] Fatal Error!', error.code, error.name)

    res.sendStatus(error.code)
    next()
  }
}))

app.listen(PORT)
