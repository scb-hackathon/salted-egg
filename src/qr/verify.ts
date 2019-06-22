import {api} from 'qr'
import {debug} from 'utils/logs'
import {authenticate} from 'utils/scb-authenticate'
import {TransactionResult} from 'qr/types'

export async function verifyQRCode(transactionId: string): Promise<TransactionResult> {
  const endpoint = `payment/billpayment/transactions/${transactionId}`

  const {accessToken} = await authenticate()
  debug('Access Token =', accessToken)

  const headers = {
    authorization: `Bearer ${accessToken}`,
  }

  const {data: reqData} = await api.get(endpoint, {
    headers,
    params: {
      sendingBank: '014'
    }
  })

  const {status, data} = reqData
  if (status.code !== 1000) throw new Error(status.description)

  debug('>> SCB QR Generation OK!')

  return data
}
