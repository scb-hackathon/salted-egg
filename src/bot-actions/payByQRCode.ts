import {BotResponse} from 'bot'
import {debug} from 'utils/logs'

const {BASE_URL, BILLER_ID} = process.env

export function payByQRCode(amount: string, sender: string): BotResponse {
  debug(`>> Requesting QR for ${amount} THB to ${BILLER_ID}`)

  return {
    attachment: {
      type: 'image',
      payload: {
        'url': BASE_URL + '/qr/' + BILLER_ID + '/' + amount + '?fbid=' + sender,
        'is_reusable': true,
      },
    },
  }
}