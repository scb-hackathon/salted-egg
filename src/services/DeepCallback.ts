import {Request, Response} from 'express'
import {match} from 'bot'
import {PaymentCallbackHTML} from 'deeplink/PaymentCallbackHTML'
import {db, DeepLink} from 'utils/db'
import {send} from 'messenger/send'

export async function DeepCallbackRoute(req: Request, res: Response) {
  const {query} = req

  const status = match(/\?status=(\w+)/, query.ref)
  const deepLink: DeepLink = db.get('deepLink').find({transactionId: query.txn}).write()
  const {sender} = deepLink

  const htmlResponse = PaymentCallbackHTML
    .replace('{{STATUS}}', status)

  const prayuthThankYou = 'https://s1.reutersmedia.net/resources/r/?m=02&d=20150915&t=2&i=1079446612&r=LYNXNPEB8E05A&w=1280'

  send(sender, {
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

  res.send(htmlResponse)
}