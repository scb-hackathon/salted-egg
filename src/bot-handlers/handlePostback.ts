import {BotContext} from 'bot'
import {Product} from 'utils/db'
import {debug, wtf} from 'utils/logs'
import {buildContext} from 'bot/build-context'
import {performOnboarding} from 'bot/onboarding'
import {getProductsCarousel} from 'products/getProductsCarousel'
import {handleQuantityReceived, payLater, payNow} from 'bot-actions/handleQuantityReceived'

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
    await reply({
      text: `${name}ราคา ${price} บาทค่ะ จะซื้อกี่ชิ้นดีคะ?`,
      quick_replies: [{
        content_type: 'text',
        title: 'ชิ้นเดียว 🍭',
        payload: 'BUY_ONLY_ONE'
      }]
    })

    setState({asking: 'QUANTITY'})

    return
  }

  wtf(`Unimplemented Postback Action: ${type}`, action)

  await reply('รู้ไหมว่าเธอน่ารักตอนเมา โอ้ธารารัตน์เบาเบา 🎤')
}

export async function handlePostback(senderID: string, postback: Postback) {
  const {title, payload} = postback

  debug(`>> Handling Postback: ${title} (${payload})`)

  const context = buildContext(senderID)
  const {reply, setState} = context

  if (payload === 'DISPLAY_CATALOGUE_CAROUSEL') {
    await reply('เลือกดูสินค้าได้เลยนะคะ 📙')
    const carousel = await getProductsCarousel()
    await reply(carousel)

    return
  }

  if (payload === 'BUY_ONLY_ONE') {
    console.log('BUY ONLY ONE!')
    setState({asking: false})

    handleQuantityReceived(context, 1).then()

    return
  }

  if (payload === 'Q_PAY_NOW') {
    return payNow(context)
  }

  if (payload === 'Q_BROWSE_MORE') {
    return payLater(context)
  }

  const action = parsePostbackAction(payload)
  if (action) return executePostbackAction(action, context)

  if (payload === 'FACEBOOK_WELCOME') {
    return performOnboarding(context)
  }
}