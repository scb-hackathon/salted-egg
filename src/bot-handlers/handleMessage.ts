import {Bot} from 'bot'

import {debug, wtf} from 'utils/logs'
import {initContext} from 'bot/init-context'

export async function handleMessage(senderID: string, message: any) {
  const {text} = message
  if (!text) return wtf('No text in message!')

  console.log(`>> Handling Message: ${text} from ${senderID}...`)

  const context = initContext(senderID)
  const {reply} = context

  try {
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

