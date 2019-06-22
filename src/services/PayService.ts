import {Request, Response} from '@types/express'
import {generateDeepLink} from 'generateDeepLink'
import {PaymentRedirectHTML} from 'PaymentRedirectHTML'
import {debug, success} from 'logs'

export async function PayRoute(req: Request, res: Response) {
  const {account, number} = req.params
  debug(`> /pay/${account}/${number}`)

  const {deepLink} = await generateDeepLink(number)
  success(`> /pay/${account}/${number} -> ${deepLink}`)

  res.send(PaymentRedirectHTML.replace('{{DECODED}}', deepLink))
}