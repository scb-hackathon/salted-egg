import {success} from 'bot/send'
import {debug} from 'WebhookService'
import {getDeeplink} from 'getDeeplink'
import {db, DeepLink} from 'db'

const {BASE_URL} = process.env

export async function requestToPay(amount: number, sender: string) {
  const deeplink = await getDeeplink(amount)
  const {deeplinkUrl, transactionId, userRefId} = deeplink

  success(`[🦄] Deep Link: ${deeplinkUrl}`)
  debug(`> Transaction = ${transactionId} | User Ref = ${userRefId}`)

  const callback = `${BASE_URL}/deep_callback?txn=${transactionId}&ref=${userRefId}`
  const deepCallbackURL = `${deeplinkUrl}?callback_url=${callback}`
  const encoded = Buffer.from(deepCallbackURL, 'binary').toString('base64')
  const url = BASE_URL + `/redirect?url=${encoded}`

  const deepLinkRecord: DeepLink = {
    sender,
    transactionId,
    userRef: userRefId
  }

  db.get('deepLink').push(deepLinkRecord).write()

  // const url = 'https://howlonguntilprayuthleaves.com'
  debug('Redirect URL =', url)

  let image = 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F7821b17e-28f5-11e4-8b81-00144feabdc0?fit=scale-down&source=next&width=700'

  if (amount === 112) {
    image = 'https://www.bangkokpost.com/media/content/20180219/c1_1414579_620x413.jpg'
  }

  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': `จ่าย ${amount} บาทเร็ว ลุงตู่รออยู่`,
            'image_url': image,
            'subtitle': `ติดเงินลุงไว้ ${amount} บาทนะ ไม่จ่ายเดี๋ยวตามไปทวงความสุขถึงบ้าน`,
            'default_action': {
              'type': 'web_url',
              url,
              'webview_height_ratio': 'compact',
            },
            'buttons': [
              {
                'type': 'web_url',
                'url': url,
                'title': 'จ่ายเงิน',
                'webview_height_ratio': 'compact',
              },
            ],
          },
        ],
      },
    },
  }
}