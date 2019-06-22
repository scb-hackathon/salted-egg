import {send} from 'messenger/send'
import {debug} from 'utils/logs'

export async function handlePostback(senderID: string, postback: any) {
  const {payload} = postback

  debug('>> Handling Postback...')

  if (payload === 'yes') {
    return send(senderID, {'text': 'Thanks!'})
  }

  if (payload === 'no') {
    return send(senderID, {'text': 'Oops, try sending another image.'})
  }
}