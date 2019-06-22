import {ServiceQuery} from 'services/WebhookService'

const {VERIFY_TOKEN} = process.env

export function validateChallenge(query: ServiceQuery) {
  const mode = query['hub.mode']
  const token = query['hub.verify_token']
  const challenge = query['hub.challenge']

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('>> Challenge Accepted:', challenge)

      return JSON.parse(challenge)
    }
  }

  return false
}