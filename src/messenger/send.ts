import axios from 'axios'

import {debug, success} from 'utils/logs'

const {PAGE_ACCESS_TOKEN} = process.env

export interface QuickReply {
  content_type: 'text' | 'user_phone_number' | 'user_email'
  title?: string
  payload?: string
  image_url?: string
}

export interface Message {
  text?: string
  attachment?: any
  quick_replies?: QuickReply[]
}

export async function send(sender: string, message: Message) {
  if (!message) return
  const {text, quick_replies} = message

  const payload = {
    recipient: {
      id: sender,
    },
    message,
    messaging_type: "RESPONSE"
  }

  if (quick_replies) {
    const replies = quick_replies.map(x => x.title).join(', ')

    console.log(`[💬] Quick Replies:`, replies)
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
