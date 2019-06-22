import {TransactionResult} from 'qr/types'
import {resetCart} from 'bot-actions/resetCart'
import {createReply} from 'bot/create-reply'
import {handlePaymentSuccess} from 'bot-actions/handlePaymentSuccess'
import {buildContext} from 'bot/build-context'

export async function thankYouQR(sender: string, txResult: TransactionResult) {
  const {sender: scbSender} = txResult
  const {displayName} = scbSender

  const ctx = buildContext(sender)

  await handlePaymentSuccess(ctx, displayName)
}
