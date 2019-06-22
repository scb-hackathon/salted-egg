import {debug, success} from 'utils/logs'
import {getDeeplink} from 'deeplink/getDeeplink'

const {BASE_URL} = process.env

export async function generateDeepLink(amount: number) {
  const deeplink = await getDeeplink(amount)
  const {deeplinkUrl, transactionId, userRefId} = deeplink

  success(`[🦄] Deep Link: ${deeplinkUrl}`)
  debug(`> Transaction = ${transactionId} | User Ref = ${userRefId}`)

  const callback = `${BASE_URL}/deep_callback?txn=${transactionId}&ref=${userRefId}`
  const deepCallbackURL = `${deeplinkUrl}?callback_url=${callback}`
  const encoded = Buffer.from(deepCallbackURL, 'binary').toString('base64')

  return {redirect: BASE_URL + `/redirect?url=${encoded}`, deepLink: deeplinkUrl}
}