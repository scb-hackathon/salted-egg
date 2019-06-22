import {Request, Response} from 'express'

import {match} from 'bot'
import {db, DeepLink} from 'utils/db'
import {thankYou} from 'bot-actions/thankYou'
import {PaymentCallbackHTML} from 'deeplink/PaymentCallbackHTML'
import {success} from 'utils/logs'

export async function DeepCallbackRoute(req: Request, res: Response) {
  const {query} = req

  const status = match(/\?status=(\w+)/, query.ref)
  const deepLink: DeepLink = db.get('deepLink').find({transactionId: query.txn}).write()
  const {sender} = deepLink

  const htmlResponse = PaymentCallbackHTML
    .replace('{{STATUS}}', status)

  success(`Customer ${sender} bought our product! 🎉`)

  thankYou(sender).then()

  res.send(htmlResponse)
}