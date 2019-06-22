import {Bot, BotContext} from 'bot'
import {send} from 'messenger/send'

function createReply(sid: string) {
  return function reply(response: string | object) {
    if (typeof response === 'string') {
      return send(sid, {text: response})
    }

    return send(sid, response)
  }
}

export function wtf(...args: any[]) {
  console.error(`[🔥]`, ...args)
}

export async function handleMessage(senderID: string, message: any) {
  const {text} = message
  if (!text) return wtf('No text in message!')

  const reply = createReply(senderID)
  console.log(`>> Handling Message: ${text} from ${senderID}...`)

  try {
    const context: BotContext = {
      sender: senderID,
      reply,
    }

    console.log('--- BOT START ---')

    const result = await Bot(message, context)
    if (!result) return

    console.log('--- BOT END ---')

    return reply(result)
  } catch (error) {
    wtf('Error in handleMessage:', error.message)

    return reply(`🦄 รอสักครู่นะคะ`)
  }
}

