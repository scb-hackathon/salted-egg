import {BotContext} from 'bot'
import {Product} from 'utils/db'
import {debug, wtf} from 'utils/logs'
import {buildContext} from 'bot/build-context'
import {performOnboarding} from 'bot/onboarding'
import {getProductsCarousel} from 'products/getProductsCarousel'

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
  const {reply, setState} = ctx
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

  const context = buildContext(senderID)
  const {reply} = context

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