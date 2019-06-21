import {send} from './send'
import {Bot, BotContext} from 'bot/Bot'

function createReply(sid: string) {
  return function reply(response: string | object) {
    if (typeof response === 'string') {
      return send(sid, {text: response})
    }

    return send(sid, response)
  }
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
    const context: BotContext = {reply, sender: senderID}

    const result = await Bot(message, context)
    if (!result) return

    return reply(result)
  } catch (error) {
    wtf('Something bad happened:', error.message)

    return reply(`🦄 รอสักครู่นะคะ`)
  }
}

