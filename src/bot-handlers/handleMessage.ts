import {Bot} from 'bot'
import {debug, wtf} from 'utils/logs'
import {buildContext} from 'bot/build-context'

export async function handleMessage(senderID: string, message: any) {
  const {text} = message
  if (!text) return wtf('No text in message!')

  console.log(`>> Handling Message: ${text} from ${senderID}...`)

  const context = buildContext(senderID)
  const {reply} = context

  try {
    debug('--- BOT START ---')

    const result = await Bot(message, context)

    // The bot already handles the reply by itself.
    if (!result) return debug('Bot returns no result.')

    debug('--- BOT END ---')

    return reply(result)
  } catch (error) {
    wtf('Error in handleMessage:', error.message)

    return reply(`🦄 รอสักครู่นะคะ`)
  }
}

