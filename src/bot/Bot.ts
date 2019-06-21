import {QueryResult} from 'dialogflow'

import {db, Item} from 'db'

interface ChatMessage {
  text: string
}

export interface BotContext {
  sender: string
  reply: (response: string | object) => Promise<void>
  dialogflow?: QueryResult
}

const match = (regex: RegExp, text: string) => {
  const m = regex.exec(text)
  if (!m) return false

  return m[1]
}

const howMuchItemRegex = /([ก-๙]+)กี่บาท/

function getItemName(text: string) {
  const item = match(howMuchItemRegex, text)
  if (!item) return 'อันนี้'

  const priceRegex = /ราคา/g

  return item.replace(priceRegex, '')
}

export async function Bot(message: ChatMessage, ctx: BotContext): Promise<string | object> {
  const {text} = message
  const {dialogflow} = ctx

  if (dialogflow) {
    const {fulfillmentText, intent, parameters} = dialogflow
    const {fields} = parameters
    const {name, displayName} = intent

    console.log('[💬] Fulfillment Response:', fulfillmentText)
    console.log(`[💬] Intent: ${displayName} (${name})`)

    if (fields.ProductNames) {
      const {stringValue: productName} = fields.ProductNames

      if (Math.random() > 0.7) {
        return `${productName}หมดแล้วค่ะ ขอโทษด้วยนะคะ`
      }
    }

    if (fulfillmentText) return fulfillmentText
  }

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