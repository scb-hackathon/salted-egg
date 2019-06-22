import {BotContext} from 'bot'
import {debug, wtf} from 'utils/logs'
import {createReply} from 'bot/create-reply'
import {performOnboarding} from 'bot/onboarding'
import {Product} from 'utils/db'
import {getProductsCarousel} from 'products/getProductsCarousel'
import {botStateMap, BotStateMap, makeSetState} from 'bot/state'

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
  const {reply, state, setState} = ctx
  let {type, payload} = action

  console.info(`>> Postback Action: ${type} =>`, payload)

  if (type === 'BUY') {
    const {name, price} = payload as Product
    await reply(`${name}ราคา ${price} บาทค่ะ จะซื้อกี่ชิ้นดีคะ?`)

    setState({asking: 'QUANTITY'})

    return
  }

  wtf('')

  await reply('รู้ไหมว่าเธอน่ารักตอนเมา โอ้ธารารัตน์เบาเบา 🎤')
}

export async function handlePostback(senderID: string, postback: Postback) {
  const {title, payload} = postback

  debug(`>> Handling Postback: ${title} (${payload})`)

  const reply = createReply(senderID)
  const state = botStateMap[senderID]

  const context: BotContext = {
    sender: senderID,
    reply,
    state,
    setState: makeSetState(senderID)
  }

  if (payload === 'DISPLAY_CATALOGUE_CAROUSEL') {
    await reply('เลือกดูสินค้าได้เลยนะคะ 📙')
    const carousel = await getProductsCarousel()
    await reply(carousel)

    return
  }

  const action = parsePostbackAction(payload)
  if (action) return executePostbackAction(action, context)

  if (payload === 'FACEBOOK_WELCOME') {
    return performOnboarding(context)
  }
}