import {BotContext} from 'bot'

export async function handleQuantityReceived(ctx: BotContext, quantity: number) {
  const {reply} = ctx
  console.info('Item Quantity =', quantity)

  await reply(`โอเคค่ะ รับเป็น ${quantity} ชิ้นนะคะ`)

  await reply({
    text: 'ต้องการรับอะไรเพิ่มไหมคะ? 💬',
    quick_replies: [
      {
        "content_type": "text",
        "title": "Hello",
        "payload": 'Hello',
      },
      {
        "content_type": "text",
        "title": "Hello",
        "payload": "Hello",
      }
    ]
  })
}