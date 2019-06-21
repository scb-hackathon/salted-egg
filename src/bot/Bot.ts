import {QueryResult} from 'dialogflow'
import {runDialogflow} from 'runDialogflow'

import {db, Item} from 'db'
import {requestToPay} from 'bot/requestToPay'

interface ChatMessage {
  text: string
}

type BotResponse = string | object

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

export function handleDialogflow(dialogflow: QueryResult | null): BotResponse | false {
  if (!dialogflow) return false

  const {fulfillmentText, parameters} = dialogflow
  const {fields} = parameters

  if (fields.ProductNames) {
    const {stringValue: productName} = fields.ProductNames

    if (Math.random() > 0.9) {
      return `${productName}หมดแล้วค่ะ ขอโทษด้วยนะคะ`
    }
  }

  if (fulfillmentText) return fulfillmentText

  return false
}

export async function Bot(message: ChatMessage, ctx: BotContext): Promise<BotResponse> {
  const {text} = message

  if (text.includes('/prayuth')) {
    return 'https://howlonguntilprayuthleaves.com'
  }

  if (text.includes('/pay')) {
    return requestToPay(text)
  }

  const dialogflow = await runDialogflow(text)

  const response = handleDialogflow(dialogflow)
  if (response) return response

  if (text.includes('กี่บาท')) {
    const name = getItemName(text)
    const price = Math.floor(Math.random() * 1000)
    const item: Item = {name, price}

    db.get('cart.' + ctx.sender).push(item).write()

    return `${name}ราคา ${price} บาทครับ 🦄`
  }

  if (text.includes('จ่าย')) {
    const items: Item[] = db.get('cart.' + ctx.sender).value()
    if (items.length < 1) {
      return `เอ๊ะ จะซื้ออะไรนะ ขออีกรอบได้มั้ยอ่า 🦄`
    }

    const {name, price} = items[0]

    return `ซื้อ${name} ราคา ${price} กดที่ลิ้งค์นี้เบย: pay.scb/phoomparin/${price}`
  }

  return `🦄 คุณส่งข้อความมาว่า: ${text} ใช่มั้ย?`
}