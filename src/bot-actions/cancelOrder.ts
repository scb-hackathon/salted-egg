import {BotContext, BotResponse} from 'bot'
import {getProductsCarousel} from 'products/getProductsCarousel'
import {resetState} from 'bot-actions/reset'

export async function cancelOrder(ctx: BotContext): Promise<BotResponse> {
  const {reply} = ctx
  await resetState(ctx)

  await reply(`ยกเลิกออร์เดอร์เรียบร้อยแล้วค่ะ 🙆‍♀️`)
  await reply(`ลองเลือกดูสินค้าอื่นได้เลยนะคะ 📙`)

  const carousel = await getProductsCarousel()
  await reply(carousel)

  return false
}