import {Request, Response} from 'express'

import {debug, success} from 'utils/logs'
import {PaymentRedirectHTML} from 'deeplink/PaymentRedirectHTML'
import {generateDeepLink} from 'deeplink/generateDeepLink'

export async function PayRoute(req: Request, res: Response) {
  const {account, number} = req.params
  debug(`> /pay/${account}/${number}`)

  const {deepLink} = await generateDeepLink(number)
  success(`> /pay/${account}/${number} -> ${deepLink}`)

  res.send(PaymentRedirectHTML.replace('{{DECODED}}', deepLink))
}