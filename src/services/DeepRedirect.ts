import {Request, Response} from 'express'
import {PaymentRedirectHTML} from 'PaymentRedirectHTML'

export function RedirectRoute(req: Request, res: Response) {
  const {url} = req.query
  const decoded = Buffer.from(url, 'base64').toString('binary')
  console.log('> Redirecting to Decoded URL =', decoded)

  res.send(PaymentRedirectHTML.replace('{{DECODED}}', decoded))
}