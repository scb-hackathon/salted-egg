import axios from 'axios'

import {debug} from 'WebhookService'
import chalk from 'chalk'

// Your verify token. Should be a random string.
const {PAGE_ACCESS_TOKEN} = process.env

export function success(text: string, ...args: any[]) {
  console.info(chalk.green(chalk.bold(text)), ...args)
}

export async function send(sender: string, response: any) {
  const payload = {
    recipient: {
      id: sender,
    },
    message: response,
  }

  if (response.text) {
    console.log(`[🦄] Replying: ${response.text}`)
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

    success('[⚡️] Request is sent!')
  } catch (err) {
    if (err.response) {
      const {data} = err.response

      if (data.error) {
        debug(`[🔥] Error: ${data.error.message}`)
      }
    }
  }
}
