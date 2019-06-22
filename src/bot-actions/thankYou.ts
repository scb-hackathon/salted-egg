import {createReply} from 'bot/create-reply'

import {resetCart} from './resetCart'
import {handlePaymentSuccess} from 'bot-actions/handlePaymentSuccess'
import {buildContext} from 'bot/build-context'
import {resetState} from 'bot-actions/reset'

export async function thankYou(sender: string) {
  const ctx = buildContext(sender)
  await resetState(ctx)

  await handlePaymentSuccess(ctx)
}