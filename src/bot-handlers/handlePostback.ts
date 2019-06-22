import {BotContext} from 'bot'
import {debug, wtf} from 'utils/logs'
import {createReply} from 'bot/create-reply'
import {performOnboarding} from 'bot/onboarding'

interface Postback {
  title: string,
  payload: string
}

interface PostbackAction {
  type: string
  payload: any
}

export function parsePostbackAction(payload: string): PostbackAction | false {
  try {
    const item = JSON.parse(payload)
    if (!item) return false
    if (!item.type) return false

    return item
  } catch (error) {
    return false
  }
}

export async function executePostbackAction(action: PostbackAction, ctx: BotContext) {
  const {reply} = ctx
  const {type, payload} = action

  console.info(`>> Postback Action: ${type} =>`, payload)

  if (type === 'BUY') {
    await reply(`${payload.item}ราคา ${payload.price} บาทค่ะ จะซื้อกี่ชิ้นดีคะ?`)

    return
  }

  wtf('')

  await reply('รู้ไหมว่าเธอน่ารักตอนเมา โอ้ธารารัตน์เบาเบา 🎤')
}

export async function handlePostback(senderID: string, postback: Postback) {
  const {title, payload} = postback

  debug(`>> Handling Postback: ${title} (${payload})`)

  const reply = createReply(senderID)

  const context: BotContext = {
    sender: senderID,
    reply,
  }

  const action = parsePostbackAction(payload)
  if (action) return executePostbackAction(action, context)

  if (payload === 'FACEBOOK_WELCOME') {
    return performOnboarding(context)
  }
}