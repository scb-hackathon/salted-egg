import {Bot, BotContext} from 'bot'

import {createReply} from 'bot/create-reply'
import {wtf} from 'utils/logs'

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

