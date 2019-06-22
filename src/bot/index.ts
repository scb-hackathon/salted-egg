import {Cart, db} from 'utils/db'

import {addToCart} from 'bot-actions/addToCart'
import {resetCart} from 'bot-actions/resetCart'
import {handlePayment} from 'bot-actions/payment'
import {requestToPay} from 'bot-actions/requestToPay'
import {getQuotation} from 'bot-actions/getQuotation'
import {runDialogflow} from 'bot-actions/runDialogflow'
import {viewProductsList} from 'products/viewProductsList'
import {setPersistentMenu} from 'bot-actions/setPersistentMenu'

import {handleDialogflow} from 'bot-handlers/handleDialogflow'

import {buildReceipt} from 'products/receipt'
import {getProductsCarousel} from 'products/getProductsCarousel'
import {wtf} from 'utils/logs'
import {handleQuantityReceived, payLater, payNow} from 'bot-actions/handleQuantityReceived'

import {Message} from 'messenger/send'

export type BotResponse = string | Message | boolean

export type Question = 'QUANTITY' | 'PAY_NOW_OR_NOT'

export interface BotState {
  asking: Question | false
}

export type BotStateMap = {
  [customer: string]: BotState
}

export interface BotContext {
  sender: string
  reply: (response: BotResponse) => Promise<void>
  state: BotState,
  setState: (state: BotState) => void
}

export function match(regex: RegExp, text: string) {
  const m = regex.exec(text)
  if (!m) return ''

  return m[1]
}

export async function Bot(message: Message, ctx: BotContext): Promise<BotResponse> {
  const {text = ''} = message
  const {sender, state, setState} = ctx

  const rtp = (amount: number) => requestToPay(amount, sender)

  if (state.asking === 'QUANTITY') {
    if (text.includes('ชิ้นเดียว')) {
      handleQuantityReceived(ctx, 1).then()

      return false
    }

    const quantity = parseInt(text.trim(), 10)

    if (quantity) {
      handleQuantityReceived(ctx, quantity).then()

      return false
    }

    wtf(`>> Input is not a number: ${text}`)

    return `ต้องการซื้อกี่ชิ้นดีคะ?`
  }

  if (state.asking === 'PAY_NOW_OR_NOT') {
    if (/ใช่|เลย|ซื้อเลย/.test(text)) {
      return payNow(ctx)
    }

    if (/ไม่|เดี๋ยวค่อย|ดูก่อน/.test(text)) {
      return payLater(ctx)
    }

    return 'ต้องการจะซื้อเลยไหมคะ?'
  }

  if (text.includes('/hqr')) {
    return handleQuantityReceived(ctx, 1000).then()
  }

  if (text.includes('/reset')) {
    resetCart(sender)

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
    const list = products.filter(p => p.buyer === sender)

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