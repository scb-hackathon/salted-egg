import {Cart, db} from 'utils/db'
import {buildReceipt} from 'products/receipt'
import {BotContext} from 'bot'
import {retrievePaymentMethod} from 'bot-actions/retrievePaymentMethod'
import {handleCartEmpty} from 'bot-actions/handleCartEmpty'

export function retrieveCartInfo(sender: string) {
  const products: Cart[] = db.get('cart').value()
  if (!products) return false

  const cart = products.filter(p => p.buyer === sender)
  const count = cart.length
  const totalPrice = cart.map(x => x.price).reduce((x, y) => x + y, 0)

  return {cart, count, totalPrice}
}

export async function handlePayment(ctx: BotContext) {
  const {reply, sender} = ctx

  const cartInfo = retrieveCartInfo(sender)
  if (!cartInfo) {
    return handleCartEmpty(ctx)
  }

  const {cart, count, totalPrice} = cartInfo

  if (totalPrice < 1 || count < 1) {
    return handleCartEmpty(ctx)
  }

  await reply(`ตอนนี้คุณมี ${count} อย่างในตระกร้า รวมกัน ${totalPrice} บาทค่ะ`)

  for (let index in cart) {
    const product = cart[index]

    await reply(`${index + 1}) ${product.name} - ราคา ${product.price} บาท`)
  }

  const receipt = buildReceipt(cart)
  await reply(receipt)

  console.log(`>> Customer is ready to buy ${count} items for ${totalPrice} THB! 🎉`)

  return retrievePaymentMethod()
}