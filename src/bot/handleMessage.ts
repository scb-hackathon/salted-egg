import {send} from './send'

function createReply(sid: string) {
  return function reply(response: string | object) {
    if (typeof response === 'string') {
      return send(sid, {text: response})
    }

    return send(sid, response)
  }
}

export async function handleMessage(senderID: string, message: any) {
  const {text} = message
  const reply = createReply(senderID)
  if (!text) return

  console.log(`>> Handling Message: ${text} from ${senderID}...`)

  if (text.includes('กี่บาท')) {
    return reply('🏷 ชิ้นนี้ราคา 112 บาทครับ')
  }

  if (text.includes('จ่าย')) {
    return reply('กดที่ลิ้งค์นี้เบย: pay.scb/phoomparin/112')
  }

  return reply(`🦄 You sent a message: ${text}!`)
}

