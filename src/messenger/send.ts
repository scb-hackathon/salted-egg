import axios from 'axios'

import {debug, success} from 'utils/logs'

const {PAGE_ACCESS_TOKEN} = process.env

interface Message {
  text?: string
}

export async function send(sender: string, message: Message) {
  if (!message) return
  const {text} = message

  const payload = {
    recipient: {
      id: sender,
    },
    message,
    messaging_type: "RESPONSE"
  }

  if (text) {
    console.log(`[🦄] Replying: ${text}`)
  } else {
    console.log(`[🦄] Replying non-text message to ${sender}`)
  }

  await call('messages', payload)

  success('[💖] Reply Request is sent!')
}

export async function call(service: string, payload: any) {
  try {
    // Send the HTTP request to the Messenger Platform
    const endpoint = 'https://graph.facebook.com/v3.3/me/' + service

    await axios.post(endpoint, payload, {
      params: {access_token: PAGE_ACCESS_TOKEN}
    })

    success('[🦄] Request is sent!')
  } catch (err) {
    if (err.response) {
      const {data} = err.response

      if (data.error) {
        debug(`[🔥] Error: ${data.error.message}`)
      }
    }
  }
}
