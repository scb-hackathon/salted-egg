import {BotContext} from 'bot'
import {handlePayment} from 'bot-actions/payment'
import {getProductsCarousel} from 'products/getProductsCarousel'
import {addItemToCart} from 'bot-actions/addToCart'

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
        "title": "ซื้อเลยละกัน 💖",
        "payload": "Q_PAY_NOW",
      }
    ]
  })

  setState({
    asking: 'PAY_NOW_OR_NOT',
    currentQuantity: quantity
  })
}

export async function payNow(ctx: BotContext) {
  const {reply, state, setState} = ctx
  setState({asking: false})

  await reply('โอเคค่ะ จ่ายเลยละกันเนาะ 🦄')

  const {currentItem, currentQuantity = 1} = state

  if (currentItem) {
    const {name, price} = currentItem

    addItemToCart(name, price, ctx.sender, currentQuantity)
  }

  return handlePayment(ctx)
}

export async function payLater(ctx: BotContext) {
  const {reply, setState} = ctx
  setState({asking: false})

  await reply('โอเคค่ะ ลองดูสินค้าเพิ่มเติมก่อนนะคะ 😇')

  const carousel = getProductsCarousel()
  await reply(carousel)

  return false
}