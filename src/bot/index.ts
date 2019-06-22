import {QueryResult} from 'dialogflow'

import {Cart, db} from 'utils/db'

import {requestToPay} from 'bot-actions/requestToPay'
import {runDialogflow} from 'bot-actions/runDialogflow'
import {viewProductsList} from 'products/viewProductsList'
import {setPersistentMenu} from 'bot-actions/setPersistentMenu'
import {handleDialogflow} from 'bot-handlers/handleDialogflow'

import {buildReceipt} from 'products/receipt'
import {getProductsCarousel} from 'products/getProductsCarousel'

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

const howMuchItemRegex = /([ก-๙]+)กี่บาท/

function getItemName(text: string) {
  const item = match(howMuchItemRegex, text)
  if (!item) return 'อันนี้'

  const priceRegex = /ราคา/g

  return item.replace(priceRegex, '')
}

export async function Bot(message: ChatMessage, ctx: BotContext): Promise<BotResponse> {
  const {text} = message

  const rtp = (amount: number) => requestToPay(amount, ctx.sender)

  if (text.includes('/products_list')) {
    return viewProductsList()
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

  if (text.includes('กี่บาท')) {
    const name = getItemName(text)
    const price = Math.floor(Math.random() * 1000)
    const item: Cart = {name, price, buyer: ctx.sender}

    db.get('cart').push(item).write()

    return `${name}ราคา ${price} บาทครับ 🦄`
  }

  if (text.includes('จ่าย')) {
    const products: Cart[] = db.get('cart').value()
    if (!products) return `ซื้ออะไรก่อนดีมั้ยเอ่ย?`

    const list = products.filter(p => p.buyer === ctx.sender)
    const count = list.length
    const totalPrice = list.map(x => x.price).reduce((x, y) => x + y, 0)

    // const {name, price} = products
    // console.log(`>> Items in cart: ${name} (${price} THB)`)

    await ctx.reply(`ตอนนี้คุณมี ${count} อย่างในตระกร้า รวมกัน ${totalPrice} บาทครับ`)

    for (let index in list) {
      const product = list[index]

      await ctx.reply(`${index}) ${product.name} - ราคา ${product.price} บาท`)
    }

    const receipt = buildReceipt(list)
    await ctx.reply(receipt)

    return rtp(totalPrice)
  }

  const dialogflow = await runDialogflow(text)

  const response = handleDialogflow(dialogflow)
  if (response) return response

  return `🦄 คุณส่งข้อความมาว่า: ${text} ใช่มั้ย?`
}