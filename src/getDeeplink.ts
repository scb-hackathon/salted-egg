import axios from 'axios'
import uuidv4 from 'uuid/v4'

const {APP_KEY = '', APP_SECRET, BILLER_ID} = process.env

interface AuthenHeader {
  contentType: string,
  resourceOwnerId: string,
  requestUId: string,
  acceptLanguage: string,
  channel?: string,
  authorization?: string
}

async function authenticate(): Promise<any> {
  const headers: AuthenHeader = {
    acceptLanguage: 'EN',
    contentType: 'application/json',
    requestUId: 'XXX',
    resourceOwnerId: APP_KEY,
  }

  const body = {
    applicationKey: APP_KEY,
    applicationSecret: APP_SECRET,
  }

  const endpoint = 'https://api.partners.scb/partners/sandbox/v1/oauth/token'

  const {data: reqData} = await axios.post(endpoint, body, {headers})
  const {status, data} = reqData

  if (status.code != 1000) {
    throw new Error('Authentication Failed!')
  }

  console.log('>> SCB Authentication OK!')

  return data
}

export async function getDeeplink(amount: number) {
  const {accessToken} = await authenticate()
  console.log('Access Token =', accessToken)

  const requestId = uuidv4()

  const headers: AuthenHeader = {
    requestUId: requestId,
    authorization: `Bearer ${accessToken}`,
    acceptLanguage: 'EN',
    resourceOwnerId: APP_KEY,
    contentType: 'application/json',
    channel: 'scbeasy',
  }

  const body = {
    paymentAmount: amount,
    transactionType: 'PAYMENT',
    transactionSubType: 'BPA',
    ref1: '1101213202',
    ref2: '21211212',
    accountTo: BILLER_ID,
    merchantMetaData: {
      paymentInfo: [
        {
          type: 'TEXT_WITH_IMAGE',
          title: 'salted egg',
          header: 'Hello world',
          description: 'just a salted egg',
          imageUrl: 'https://www.rotinrice.com/wp-content/uploads/2012/04/SaltedEggs-1.jpg',
        },
      ],
      analytics: {},
    },
  }

  const endpoint = `https://api.partners.scb/partners/sandbox/v2/deeplink/transactions`

  const {data} = await axios.post(endpoint, body, {headers})
  console.log('>> SCB Deep Link OK!', data)

  return data.deeplinkUrl
}
