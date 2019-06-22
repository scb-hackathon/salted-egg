import {BotContext} from 'bot'
import {handlePayment} from 'bot-actions/payment'
import {getProductsCarousel} from 'products/getProductsCarousel'

export async function handleQuantityReceived(ctx: BotContext, quantity: number) {
  const {reply, setState} = ctx
  setState({asking: false})

  console.info('Item Quantity =', quantity)

  await reply(`โอเคค่ะ รับเป็น ${quantity} ชิ้นนะคะ`)

  await reply({
    text: 'ต้องการรับอะไรเพิ่มไหมคะ? 💬',
    quick_replies: [
      {
        "content_type": "text",
        "title": "ขอดูก่อนนะ 📙",
        "payload": 'Q_BROWSE_MORE',
      },
      {
        "content_type": "text",
        "title": "ไม่ล่ะ ซื้อเลยละกัน 😎",
        "payload": "Q_PAY_NOW",
      }
    ]
  })

  setState({asking: 'PAY_NOW_OR_NOT'})
}

export async function payNow(ctx: BotContext) {
  const {reply, setState} = ctx
  setState({asking: false})

  await reply('โอเคค่ะ จ่ายเลยละกันเนาะ 🦄')

  handlePayment(ctx).then()

  return false
}

export async function payLater(ctx: BotContext) {
  const {reply, setState} = ctx
  setState({asking: false})

  await reply('โอเคค่ะ ลองดูสินค้าเพิ่มเติมก่อนนะคะ 😇')

  const carousel = getProductsCarousel()
  await reply(carousel)

  return false
}