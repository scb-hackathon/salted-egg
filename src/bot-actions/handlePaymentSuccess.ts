import {BotContext, BotResponse} from 'bot'
import {getProductsCarousel} from 'products/getProductsCarousel'

export async function handlePaymentSuccess(ctx: BotContext, displayName?: string): Promise<BotResponse> {
  const {reply} = ctx

  const prayuthThankYou = 'https://s1.reutersmedia.net/resources/r/?m=02&d=20150915&t=2&i=1079446612&r=LYNXNPEB8E05A&w=1280'

  const hasName = !!displayName
  const attribution = hasName ? `คุณ ${displayName} ` : ''

  await reply(`ได้รับเงินแล้วค่ะ ขอบคุณ${attribution}มากนะคะ 💖`)

  await reply({
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': `ประยุทธ์ขอบคุณ${attribution}คับ เจริญๆ นะหลานเอ้ย`,
            'image_url': prayuthThankYou,
            'subtitle': `ในที่สุดก็จ่ายสักที รอมาห้าปีแล้ว`,
          },
        ],
      },
    },
  })

  await reply(`ถ้าต้องการซื้ออะไรเพิ่มเติม สามารถสอบถามได้ตลอดเวลาเลยนะคะ ขอบคุณค่า 🙏`)

  const carousel = getProductsCarousel()
  await reply(carousel)

  return false
}