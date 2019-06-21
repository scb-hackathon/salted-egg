import {match} from 'bot/Bot'
import {success} from 'bot/send'
import {debug} from 'WebhookService'
import {getDeeplink} from 'getDeeplink'

export async function requestToPay(text: string) {
  const payAmountRegex = /\/pay (\d+)/
  const amountText = match(payAmountRegex, text)
  const amount = parseInt(amountText || '100', 10)

  const deeplink = await getDeeplink(amount)
  const {deeplinkUrl, transactionId, userRefId} = deeplink

  success(`[🦄] Deep Link: ${deeplinkUrl}`)
  debug(`> Transaction = ${transactionId} | User Ref = ${userRefId}`)

  const baseURL = 'https://1d747d7e.ngrok.io'
  const url = baseURL + `/redirect?url=${encodeURIComponent(deeplinkUrl)}`
  debug('Redirect URL =', url)

  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': 'จ่ายเร็ว ลุงตู่รออยู่',
            'image_url': 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F7821b17e-28f5-11e4-8b81-00144feabdc0?fit=scale-down&source=next&width=700',
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