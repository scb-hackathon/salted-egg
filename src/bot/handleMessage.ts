import {reply} from 'bot/reply'

export async function handleMessage(senderID: string, message: any) {
  const {text} = message

  console.log('>> Handling Message')

  if (text) {
    const response = {
      'text': `🦄 You sent a message: ${text}.`,
    }

    return reply(senderID, response)
  }
}

