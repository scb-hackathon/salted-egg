import {QueryResult} from 'dialogflow'

import {Cart, db} from 'utils/db'

import {addToCart} from 'bot-actions/addToCart'
import {resetCart} from 'bot-actions/resetCart'
import {handlePayment} from 'bot-actions/payment'
import {requestToPay} from 'bot-actions/requestToPay'
import {runDialogflow} from 'bot-actions/runDialogflow'
import {viewProductsList} from 'products/viewProductsList'
import {setPersistentMenu} from 'bot-actions/setPersistentMenu'

import {handleDialogflow} from 'bot-handlers/handleDialogflow'

import {buildReceipt} from 'products/receipt'
import {getProductsCarousel} from 'products/getProductsCarousel'
import {getQuotation} from 'bot-actions/getQuotation'

interface ChatMessage {
  text: string
}

export type BotResponse = string | object

export interface BotContext {
  sender: string
  reply: (response: BotResponse) => Promise<void>
  dialogflow?: QueryResult
}

export function match(regex: RegExp, text: string) {
  const m = regex.exec(text)
  if (!m) return ''

  return m[1]
}

export async function Bot(message: ChatMessage, ctx: BotContext): Promise<BotResponse> {
  const {text} = message

  const rtp = (amount: number) => requestToPay(amount, ctx.sender)

  if (text.includes('/list')) {
    return viewProductsList()
  }

  if (text.includes('/reset')) {
    resetCart(ctx.sender)

    return 'Cart is reset! 🔥'
  }

  if (text.includes('/set_menu')) {
    return setPersistentMenu()
  }

  if (text.includes('/products')) {
    return getProductsCarousel()
  }

  if (text.includes('/prayuth')) {
    return 'https://howlonguntilprayuthleaves.com'
  }

  if (text.includes('/ssj')) {
    return rtp(112)
  }

  if (text.includes('/pay')) {
    const payAmountRegex = /\/pay (\d+)/
    const amountText = match(payAmountRegex, text)
    const amount = parseInt(amountText || '100', 10)

    return rtp(amount)
  }

  if (text.includes('/receipt')) {
    const products: Cart[] = db.get('cart').value()
    const list = products.filter(p => p.buyer === ctx.sender)

    return buildReceipt(list)
  }

  if (/กี่บาท|ราคา/.test(text)) {
    return getQuotation(ctx, text)
  }

  if (/ซื้อ/.test(text)) {
    return addToCart(ctx, text)
  }

  if (text.includes('จ่าย')) {
    return handlePayment(ctx)
  }

  const dialogflow = await runDialogflow(text)

  const response = handleDialogflow(dialogflow)
  if (response) return response

  return `🦄 คุณส่งข้อความมาว่า: ${text} ใช่มั้ย?`
}