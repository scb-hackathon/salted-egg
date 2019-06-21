import {send} from 'send.ts'

export async function handlePostback(senderID: string, postback: any) {
  const {payload} = postback

  console.log('>> Handling Postback')

  if (payload === 'yes') {
    return send(senderID, {'text': 'Thanks!'})
  }

  if (payload === 'no') {
    return send(senderID, {'text': 'Oops, try sending another image.'})
  }
}