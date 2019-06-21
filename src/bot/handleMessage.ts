import {send} from './send'
import {Bot, BotContext} from 'bot/Bot'
import {runDialogflow} from 'runDialogflow.ts'

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
    const dialogflow = await runDialogflow(text)

    if (dialogflow) {
      const {fulfillmentText, intent} = dialogflow
      const {name, displayName} = intent

      console.log('[💬] Fulfillment Response:', fulfillmentText)
      console.log(`[💬] Intent: ${displayName} (${name})`)
    }

    const context: BotContext = {
      sender: senderID,
      reply,
      dialogflow,
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

