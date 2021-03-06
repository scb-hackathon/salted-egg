import {BotContext, match} from 'bot'
import {Cart, CurrentItemMap, db, PriceMap} from 'utils/db'
import {wtf} from 'utils/logs'

const buyItemRegex = /ซื้อ\s?([ก-๙]+|\w+\s?)/

function getBuyItemName(text: string) {
  const item = match(buyItemRegex, text)
  if (!item) return null

  return item.trim()
}

export function addItemToCart(name: string, price: number, buyer: string, quantity = 0) {
  const item: Cart = {name, price, buyer, quantity}

  db.get('cart').push(item).write()
}

export async function addToCart(ctx: BotContext, text: string) {
  let name = getBuyItemName(text)

  if (!name) {
    const currentItem = CurrentItemMap[ctx.sender]
    if (currentItem) name = currentItem
  }

  if (!name) {
    wtf(`Cannot detect the item name. Displaying item sold-out instead.`)

    return `สินค้าหมดแล้วค่ะ ขออภัยด้วยนะคะ`
  }

  let price = PriceMap[name.trim()]
  if (!price) price = Math.floor(Math.random() * 1000)

  console.log(`>> Customer added ${name} (${price} THB) to cart! 😎`)

  addItemToCart(name, price, ctx.sender, 1)

  return `เพิ่ม${name}ลงตะกร้าแล้วค่ะ ราคา ${price} บาทนะคะ 💖`
}