import {BotContext} from '.'
import {getProductsCarousel} from 'products/getProductsCarousel'

export async function performOnboarding(ctx: BotContext)  {
  const {reply} = ctx

  await reply('ร้าน Salted Egg & Bubble Tea สวัสดีครับ! 💖')
  await reply('ลองเลือกดูสินค้าก่อนได้เลยครับ 😃')

  const carousel = await getProductsCarousel()
  await reply(carousel)
}