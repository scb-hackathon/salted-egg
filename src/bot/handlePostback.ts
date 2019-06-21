import {reply} from 'bot/reply'

export async function handlePostback(senderID: string, postback: any) {
  const {payload} = postback

  console.log('>> Handling Postback')

  if (payload === 'yes') {
    return reply(senderID, {'text': 'Thanks!'})
  }

  if (payload === 'no') {
    return reply(senderID, {'text': 'Oops, try sending another image.'})
  }
}