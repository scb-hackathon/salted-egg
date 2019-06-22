import {send} from 'messenger/send'
import {debug} from 'utils/logs'
import {performOnboarding} from 'bot/onboarding'
import {createReply} from 'bot/create-reply'
import {BotContext} from 'bot'

export async function handlePostback(senderID: string, postback: any) {
  const {title, payload} = postback

  debug(`>> Handling Postback: ${title} (${payload})`)

  const reply = createReply(senderID)

  const context: BotContext = {
    sender: senderID,
    reply,
  }

  if (payload === 'FACEBOOK_WELCOME') {
    return performOnboarding(context)
  }

  if (payload === 'yes') {
    return send(senderID, {'text': 'Thanks!'})
  }

  if (payload === 'no') {
    return send(senderID, {'text': 'Oops, try sending another image.'})
  }
}