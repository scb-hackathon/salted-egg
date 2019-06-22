import {BotContext, BotResponse} from 'bot'
import {retrieveCartInfo} from 'bot-actions/payment'
import {handleCartEmpty} from 'bot-actions/handleCartEmpty'
import {payByQRCode} from 'bot-actions/payByQRCode'
import {requestToPay} from 'bot-actions/requestToPay'
import {debug} from 'utils/logs'

const {BASE_URL, BILLER_ID} = process.env

export async function retrievePaymentMethod(ctx: BotContext, text?: string): Promise<BotResponse> {
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
      const res = await requestToPay(totalPrice, sender)
      await reply(res)
    } else if (/QR|คิวอา|Code/i.test(text)) {
      const res = await payByQRCode(String(totalPrice), sender)
      await reply(res)
    } else if (/เพื่อน|friend|best|web|link/i.test(text)) {
      debug(`> Biller ID = ${BILLER_ID}`)

      const url = `${BASE_URL}/pay/${BILLER_ID}/${totalPrice}`

      await reply(`ส่งลิงค์นี้ให้เพื่อนเพื่อจ่ายเงินได้เลยค่ะ: ${url} 🌍`)
    } else {
      return retrievePaymentMethod(ctx)
    }

    setState({awaitingPayment: true})

    return {
      text: 'ถ้าติดปัญหาอะไรสามารถสอบถามได้เลยนะคะ 🙏',
      quick_replies: [{
        content_type: 'text',
        title: 'เปลี่ยนวิธีจ่าย 💵',
        payload: 'CHANGE_PAYMENT_METHOD'
      }, {
        content_type: 'text',
        title: 'ยกเลิกสินค้า ❌',
        payload: 'CANCEL_ORDER'
      }]
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