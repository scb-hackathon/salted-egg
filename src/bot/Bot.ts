interface ChatMessage {
  text: string
}

export interface BotContext {
  reply: (response: string | object) => Promise<void>
}

const howMuchItemRegex = /([ก-๙]+)กี่บาท/
const match = (regex: RegExp, text: string) => {
  const m = regex.exec(text)
  if (!m) return false

  return m[1]
}

function getItemName(text: string) {
  const item = match(howMuchItemRegex, text)
  if (!item) return 'อันนี้'

  const priceRegex = /ราคา/g

  return item.replace(priceRegex, '')
}

export async function Bot(message: ChatMessage, ctx: BotContext): Promise<string | object> {
  const {text} = message

  if (text.includes('กี่บาท')) {
    const item = getItemName(text)

    const price = Math.floor(Math.random() * 1000)

    return `${item}ราคา ${price} บาทครับ 🦄`
  }

  if (text.includes('จ่าย')) {
    return 'กดที่ลิ้งค์นี้เบย: pay.scb/phoomparin/112'
  }

  return `🦄 คุณส่งข้อความมาว่า: ${text} ใช่มั้ย?`
}