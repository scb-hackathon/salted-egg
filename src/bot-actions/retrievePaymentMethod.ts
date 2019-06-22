import {BotResponse} from 'bot'

export function retrievePaymentMethod(): BotResponse {
  return {
    text: 'ต้องการชำระเงินผ่านช่องทางไหนคะ? 💵',
    quick_replies: [{
      content_type: 'text',
      title: 'แอพ SCB 📱',
      payload: 'PAY_BY_SCB_APP',
    }, {
      content_type: 'text',
      title: 'QR Code 📷',
      payload: 'PAY_BY_QR_CODE',
    }, {
      content_type: 'text',
      title: 'ให้เพื่อนจ่าย 👫',
      payload: 'PAY_BY_SCB_BEST',
    }],
  }
}