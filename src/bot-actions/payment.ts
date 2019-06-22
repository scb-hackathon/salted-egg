import {Cart, db} from 'utils/db'
import {buildReceipt} from 'products/receipt'
import {BotContext} from 'bot'
import {requestToPay} from 'bot-actions/requestToPay'

export async function handlePayment(ctx: BotContext) {
  const {reply, sender} = ctx

  const products: Cart[] = db.get('cart').value()
  if (!products) return `ซื้ออะไรก่อนดีมั้ยเอ่ย?`

  const list = products.filter(p => p.buyer === sender)
  const count = list.length
  const totalPrice = list.map(x => x.price).reduce((x, y) => x + y, 0)

  if (totalPrice < 1 || count < 1) {
    return `คุณยังไม่ได้เลือกซื้ออะไรเลย ลองซื้ออะไรดูก่อนมั้ย 🍭`
  }

  await reply(`ตอนนี้คุณมี ${count} อย่างในตระกร้า รวมกัน ${totalPrice} บาทค่ะ`)

  for (let index in list) {
    const product = list[index]

    await reply(`${index}) ${product.name} - ราคา ${product.price} บาท`)
  }

  const receipt = buildReceipt(list)
  await reply(receipt)

  console.log(`>> Customer is ready to buy ${count} items for ${totalPrice} THB! 🎉`)

  return requestToPay(totalPrice, sender)
}