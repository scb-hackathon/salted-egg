import {Bot, BotContext} from 'bot'

import {createReply} from 'bot/create-reply'
import {debug, wtf} from 'utils/logs'
import {botStateMap, BotStateMap, makeSetState} from 'bot/state'

export async function handleMessage(senderID: string, message: any) {
  const {text} = message
  if (!text) return wtf('No text in message!')

  const reply = createReply(senderID)
  const state = botStateMap[senderID]

  console.log(`>> Handling Message: ${text} from ${senderID}...`)

  try {
    const context: BotContext = {
      sender: senderID,
      reply,
      state,
      setState: makeSetState(senderID)
    }

    debug('--- BOT START ---')

    const result = await Bot(message, context)
    if (!result) {
      wtf(`Bot returns no result:`, context.sender)

      return reply(`...`)
    }

    debug('--- BOT END ---')

    return reply(result)
  } catch (error) {
    wtf('Error in handleMessage:', error.message)

    return reply(`🦄 รอสักครู่นะคะ`)
  }
}

