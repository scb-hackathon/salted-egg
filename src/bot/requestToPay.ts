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
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: `สินค้าชิ้นนี้ราคา ${amount} บาทนะคะ`,
        buttons: [
          {
            type: 'web_url',
            url,
            title: `จ่ายเงิน`,
            webview_height_ratio: 'full',
          },
        ],
      },
    },
  }
}