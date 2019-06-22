import {BotContext, BotResponse} from 'bot'

export async function handleCartEmpty(ctx: BotContext): BotResponse {
  await ctx.reply({
    text: 'คุณยังไม่ได้เลือกซื้ออะไรเลย ลองซื้ออะไรดูก่อนมั้ย 🍭',
    quick_replies: [{
      content_type: 'text',
      title: 'ดูสินค้า',
      payload: 'DISPLAY_CATALOGUE_CAROUSEL',
    }]
  })

  return false
}