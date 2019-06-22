import axios from 'axios'
import uuid from 'uuid'

import {authenticate} from 'utils/scb-authenticate'
import {debug} from 'utils/logs'

const {APP_KEY = '', BILLER_ID} = process.env

export const api = axios.create({
  baseURL: 'https://api.partners.scb/partners/sandbox/v1/',
  headers: {
    requestUId: uuid(),
    acceptLanguage: 'EN',
    resourceOwnerId: APP_KEY,
    contentType: 'application/json',
  }
})

export async function generateQRCode(amount: number) {
  const {accessToken} = await authenticate()
  debug('Access Token =', accessToken)

  const headers = {
    authorization: `Bearer ${accessToken}`,
  }

  const body = {
  	"qrType": "PP",
    "ppType": "BILLERID",
    "ppId": BILLER_ID,
    "amount": String(amount),
    "ref1": "123123",
    "ref2": "123132132",
    "ref3": "SCB1234"
  }

  const endpoint = 'payment/qrcode/create'

  const {data: reqData} = await api.post(endpoint, body, {headers})
  const {status, data} = reqData
  if (status.code !== 1000) throw new Error(status.description)

  debug('>> SCB QR Generation OK!')

  return data
}
