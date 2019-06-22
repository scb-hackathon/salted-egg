import {BotContext, BotResponse} from 'bot'
import {retrieveCartInfo} from 'bot-actions/payment'
import {handleCartEmpty} from 'bot-actions/handleCartEmpty'
import {payByQRCode} from 'bot-actions/payByQRCode'
import {requestToPay} from 'bot-actions/requestToPay'

const {BASE_URL, BILLER_ID} = process.env

export async function retrievePaymentMethod(ctx: BotContext, text: string): Promise<BotResponse> {
  const {state, setState, sender, reply} = ctx
  setState({asking: 'PAYMENT_METHOD'})

  const exit = () => setState({asking: false})

  const cartInfo = retrieveCartInfo(sender)
  if (!cartInfo) {
    exit()

    return handleCartEmpty(ctx)
  }

  const {totalPrice} = cartInfo

  if (text) {
    if (/แอพ|SCB Easy|SCB App/i.test(text)) {
      return requestToPay(totalPrice, sender)
    }

    if (/QR|คิวอา|Code/i.test(text)) {
      return payByQRCode(String(totalPrice), sender)
    }

    if (/เพื่อน|friend|best|web|link/i.test(text)) {
      const url = `${BASE_URL}/pay/${BILLER_ID}/${totalPrice}`

      return `ส่งลิงค์นี้ให้เพื่อนเพื่อจ่ายเงินได้เลยค่ะ: ${url} 🌍`
    }
  }

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