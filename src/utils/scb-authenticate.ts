import axios from 'axios'

const {APP_KEY = '', APP_SECRET} = process.env

export interface AuthenHeader {
  contentType: string,
  resourceOwnerId: string,
  requestUId: string,
  acceptLanguage: string,
  channel?: string,
  authorization?: string
}

export async function authenticate(): Promise<{accessToken: string}> {
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