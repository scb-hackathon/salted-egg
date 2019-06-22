import {createReply} from 'bot/create-reply'

import {resetCart} from './resetCart'

export async function thankYou(sender: string) {
  const prayuthThankYou = 'https://s1.reutersmedia.net/resources/r/?m=02&d=20150915&t=2&i=1079446612&r=LYNXNPEB8E05A&w=1280'
  const reply = createReply(sender)

  resetCart(sender)

  await reply('ได้รับเงินแล้วค่ะ ขอบคุณมากนะคะ 💖')

  await reply({
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': `ประยุทธ์ขอบคุณคับ เจริญๆ นะหลานเอ้ย`,
            'image_url': prayuthThankYou,
            'subtitle': `ในที่สุดก็จ่ายสักที รอมาห้าปีแล้ว`,
          },
        ],
      },
    },
  })
}