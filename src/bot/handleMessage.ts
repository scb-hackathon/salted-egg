import {send} from './send'

function createReply(sid: string) {
  return function reply(response: string | object) {
    if (typeof response === 'string') {
      return send(sid, {text: response})
    }

    return send(sid, response)
  }
}

interface ChatMessage {
  text: string
}

function Bot(message: ChatMessage): string | object {
  const {text} = message

  if (text.includes('กี่บาท')) {
    return '🏷 ชิ้นนี้ราคา 112 บาทครับ'
  }

  if (text.includes('จ่าย')) {
    return 'กดที่ลิ้งค์นี้เบย: pay.scb/phoomparin/112'
  }

  return `🦄 คุณส่งข้อความมาว่า: ${text} ใช่มั้ย?`
}

function wtf(...args: any[]) {
  console.warn(`[🔥]`, ...args)
}

export async function handleMessage(senderID: string, message: any) {
  const {text} = message
  if (!text) return wtf('No text in message!')

  const reply = createReply(senderID)
  console.log(`>> Handling Message: ${text} from ${senderID}...`)

  try {
    const result = Bot(message)
    if (!result) return

    return reply(result)
  } catch (error) {
    wtf('Something bad happened:', error.message)

    return reply(`🦄 รอสักครู่นะคะ`)
  }
}

