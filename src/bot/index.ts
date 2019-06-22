import {QueryResult} from 'dialogflow'

import {Cart, db} from 'utils/db'

import {resetCart} from 'bot-actions/resetCart'
import {requestToPay} from 'bot-actions/requestToPay'
import {runDialogflow} from 'bot-actions/runDialogflow'
import {viewProductsList} from 'products/viewProductsList'
import {setPersistentMenu} from 'bot-actions/setPersistentMenu'
import {handleDialogflow} from 'bot-handlers/handleDialogflow'

import {buildReceipt} from 'products/receipt'
import {getProductsCarousel} from 'products/getProductsCarousel'
import {handlePayment} from 'bot-actions/handlePayment'

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

const howMuchItemRegex = /([ก-๙]+|\w+\s?)กี่บาท/
const howMuchPriceRegex = /([ก-๙]+|\w+\s?)ราคา/

function getItemName(text: string) {
  let item = match(howMuchItemRegex, text)
  if (!item) item = match(howMuchPriceRegex, text)
  if (!item) item = '🍕'

  return item.trim().replace(/ราคา/g, '')
}

// TODO: Replace with persistent DB
const PriceMap: {[item: string]: number} = {}
const CurrentItemMap: {[customer: string]: string} = {}

const buyItemRegex = /ซื้อ\s?([ก-๙]+|\w+\s?)/

function getBuyItemName(text: string) {
  const item = match(buyItemRegex, text)
  if (!item) return null

  return item.trim()
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
    const name = getItemName(text)
    const price = Math.floor(Math.random() * 1000)

    PriceMap[name] = price
    CurrentItemMap[ctx.sender] = name

    console.log(`>> Customer asked for price of ${name} (${price} THB) 😃`)

    return `${name}ราคา ${price} บาทค่ะ 🦄`
  }

  if (/ซื้อ/.test(text)) {
    let name = getBuyItemName(text)

    if (!name) {
      const currentItem = CurrentItemMap[ctx.sender]
      if (currentItem) name = currentItem
    }

    if (!name) return `สินค้าหมดแล้วค่ะ ขออภัยด้วยนะคะ`

    let price = PriceMap[name.trim()]
    if (!price) price = Math.floor(Math.random() * 1000)

    console.log(`>> Customer added ${name} (${price} THB) to cart! 😎`)

    const item: Cart = {name, price, buyer: ctx.sender}

    db.get('cart').push(item).write()

    return `เพิ่ม${name}ลงตะกร้าแล้วค่ะ ราคา ${price} บาทแล้วนะคะ 💖`
  }

  if (text.includes('จ่าย')) {
    return handlePayment(ctx)
  }

  const dialogflow = await runDialogflow(text)

  const response = handleDialogflow(dialogflow)
  if (response) return response

  return `🦄 คุณส่งข้อความมาว่า: ${text} ใช่มั้ย?`
}