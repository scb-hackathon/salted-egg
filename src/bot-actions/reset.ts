import {BotContext} from 'bot'
import {resetCart} from 'bot-actions/resetCart'

export async function resetState(ctx: BotContext) {
  resetCart(ctx.sender)

  ctx.setState({
    asking: false,
    awaitingPayment: false,
    currentQuantity: undefined,
    currentItem: undefined
  })
}

