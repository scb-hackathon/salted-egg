import {Request, Response} from 'express'

import {match} from 'bot'
import {db, DeepLink} from 'utils/db'
import {thankYou} from 'bot-actions/thankYou'
import {PaymentCallbackHTML} from 'deeplink/PaymentCallbackHTML'

export async function DeepCallbackRoute(req: Request, res: Response) {
  const {query} = req

  const status = match(/\?status=(\w+)/, query.ref)
  const deepLink: DeepLink = db.get('deepLink').find({transactionId: query.txn}).write()
  const {sender} = deepLink

  const htmlResponse = PaymentCallbackHTML
    .replace('{{STATUS}}', status)

  thankYou(sender).then()

  res.send(htmlResponse)
}