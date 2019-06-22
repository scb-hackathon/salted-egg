import {Request, Response} from 'express'
import {verifyQRCode} from 'qr/verify'
import {debug} from 'utils/logs'
import {thankYou} from 'bot-actions/thankYou'
import {db, QRCode} from 'utils/db'

// {
//   payeeProxyId: '719492347382944',
//   payeeProxyType: 'BILLERID',
//   payeeAccountNumber: '0987654321',
//   payeeName: 'SaltedEggBill',
//   payerProxyId: '0812345678',
//   payerProxyType: 'MSISDN',
//   payerAccountNumber: '0123456789',
//   payerName: 'Tanu Phunsana',
//   sendingBankCode: '014',
//   receivingBankCode: '014',
//   amount: 9000,
//   transactionId: '201906227ecz2KFPkEY2u1N',
//   transactionDateandTime: '2019-06-22T22:37:04+07:00',
//   billPaymentRef1: '123123',
//   billPaymentRef3: 'SCB1234',
//   currencyCode: '764'
// }

interface PaymentConfirmResponse {
    payeeProxyId: string;
    payeeProxyType: string;
    payeeAccountNumber: string;
    payeeName: string;
    payerProxyId: string;
    payerProxyType: string;
    payerAccountNumber: string;
    payerName: string;
    sendingBankCode: string;
    receivingBankCode: string;
    amount: number;
    transactionId: string;
    transactionDateandTime: string;
    billPaymentRef1: string;
    billPaymentRef3: string;
    currencyCode: string;
}

export async function PaymentConfirmRoute(req: Request, res: Response) {
  const {body} = req
  const data = body as PaymentConfirmResponse

  debug('/payment_confirm >>', data)

  const verifyResult = await verifyQRCode(data.transactionId)

  debug('Verify Result:', verifyResult)

  const {sender, transTime, transDate, ref1, ref2, ref3} = verifyResult
  const {name, displayName} = sender

  console.log(`>> Transaction Confirmed for ${displayName} (${name}) at ${transTime} ${transDate}`)
  console.log('>> References:', ref1, ref2, ref3)

  const item: QRCode = db.get('qr').find({ref: ref1}).value()

  debug('QRCode >>', item)

  if (item) {
    const {sender: fbSender} = item

    thankYou(fbSender).then()
  }

  res.send('OK')
}