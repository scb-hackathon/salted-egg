import 'dotenv/config'

import {PayService} from 'PayService'

import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {debug, WebhookService} from 'WebhookService'
import {Request, Response} from 'express'
import {FeathersError} from '@feathersjs/errors'

import {PaymentRedirectHTML} from 'PaymentRedirectHTML'
import {PaymentCallbackHTML} from 'PaymentCallbackHTML'
import {match} from 'bot/Bot'
import {db, DeepLink} from 'db'
import {send, success} from 'bot/send'
import {ProductListHTML} from 'ProductListHTML'
import {generateDeepLink} from 'generateDeepLink'

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

app.use('/webhook', new WebhookService())

app.get('/redirect', (req: Request, res: Response) => {
  const {url} = req.query
  const decoded = Buffer.from(url, 'base64').toString('binary');
  console.log('> Redirecting to Decoded URL =', decoded)

  // res.setHeader('Location', decoded)
  // res.status(302)
  res.send(PaymentRedirectHTML.replace('{{DECODED}}', decoded))
})

app.get('/product_list', async (req: Request, res: Response) => {
  const {query} = req

  res.send(ProductListHTML)
})

app.get('/pay/:account/:number', async (req: Request, res: Response) => {
  const {account, number} = req.params
  debug(`> /pay/${account}/${number}`)

  const {deepLink} = await generateDeepLink(number)
  success(`> /pay/${account}/${number} -> ${deepLink}`)

  res.send(PaymentRedirectHTML.replace('{{DECODED}}', deepLink))
})

app.get('/deep_callback', async (req: Request, res: Response) => {
  const {query} = req

  const status = match(/\?status=(\w+)/, query.ref)
  const deepLink: DeepLink = db.get('deepLink').find({transactionId: query.txn}).write()
  const {sender} = deepLink

  const htmlResponse = PaymentCallbackHTML
    .replace("{{STATUS}}", status)

  const prayuthThankYou = 'https://s1.reutersmedia.net/resources/r/?m=02&d=20150915&t=2&i=1079446612&r=LYNXNPEB8E05A&w=1280'

  send(sender, {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': `ประยุทธ์ขอบคุณคับ เจริญๆ นะหลานเอ้ย`,
            'image_url': prayuthThankYou,
            'subtitle': `ในที่สุดก็จ่ายสักที รอมาห้าปีแล้ว`,
          },
        ],
      },
    },
  })

  res.send(htmlResponse)
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
