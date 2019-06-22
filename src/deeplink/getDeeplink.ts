import axios from 'axios'
import uuidv4 from 'uuid/v4'

import {AuthenHeader, authenticate} from 'utils/scb-authenticate'
import {debug} from 'utils/logs'

const {APP_KEY = '', BILLER_ID} = process.env

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

  const {data: reqData} = await axios.post(endpoint, body, {headers})
  const {status, data} = reqData
  if (status.code !== 1000) throw new Error(status.description)

  debug('>> SCB Deep Link OK!')

  return data
}
