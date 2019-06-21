import axios from 'axios'

import {debug} from 'WebhookService'

// Your verify token. Should be a random string.
const {PAGE_ACCESS_TOKEN} = process.env

export async function send(sender: string, response: any) {
  try {
    // Construct the message body
    const payload = {
      recipient: {
        id: sender,
      },
      message: response,
    }

    if (response.text) {
      console.log(`[🦄] Replying ${response.text}`)
    } else {
      console.log(`[🦄] Replying non-text message to ${sender}`)
    }

    // Send the HTTP request to the Messenger Platform
    const endpoint = 'https://graph.facebook.com/v2.6/me/messages'

    await axios.post(endpoint, payload, {
      params: {access_token: PAGE_ACCESS_TOKEN}
    })

    console.log('✅  Reply Request is sent!')
  } catch (err) {
    if (err.response) {
      const {data} = err.response

      if (data.error) {
        debug(`🔥 Reply Error: ${data.error.message}`)
      }
    }
  }
}
