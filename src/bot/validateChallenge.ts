const {VERIFY_TOKEN} = process.env

export function validateChallenge(query) {
  const mode = query['hub.mode']
  const token = query['hub.verify_token']
  const challenge = query['hub.challenge']

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('>> Challenge Accepted:', challenge)

      return challenge
    }
  }

  return false
}