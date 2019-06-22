import {BotContext, match} from 'bot'
import {Cart, CurrentItemMap, db, PriceMap} from 'utils/db'

const buyItemRegex = /ซื้อ\s?([ก-๙]+|\w+\s?)/

function getBuyItemName(text: string) {
  const item = match(buyItemRegex, text)
  if (!item) return null

  return item.trim()
}

export async function addToCart(ctx: BotContext, text: string) {
  let name = getBuyItemName(text)

  if (!name) {
    const currentItem = CurrentItemMap[ctx.sender]
    if (currentItem) name = currentItem
  }

  if (!name) return `สินค้าหมดแล้วค่ะ ขออภัยด้วยนะคะ`

  let price = PriceMap[name.trim()]
  if (!price) price = Math.floor(Math.random() * 1000)

  console.log(`>> Customer added ${name} (${price} THB) to cart! 😎`)

  const item: Cart = {name, price, buyer: ctx.sender}

  db.get('cart').push(item).write()

  return `เพิ่ม${name}ลงตะกร้าแล้วค่ะ ราคา ${price} บาทแล้วนะคะ 💖`
}