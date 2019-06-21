import axios from 'axios'

// Your verify token. Should be a random string.
const {PAGE_ACCESS_TOKEN} = process.env

export async function send(sender: string, response: any) {
  try {
    // Construct the message body
    const request_body = {
      recipient: {
        id: sender,
      },
      message: response,
    }

    console.log('🦄 Sending Response to:', sender)

    // Send the HTTP request to the Messenger Platform
    const endpoint = 'https://graph.facebook.com/v2.6/me/messages'

    const {data} = await axios.post(endpoint, request_body, {
      params: {access_token: PAGE_ACCESS_TOKEN}
    })

    console.log('✅ Reply Request is sent!')
  } catch (err) {
    console.log('🔥 Reply Error!')

    if (err.response) {
      const {data} = err.response

      if (data.error) {
        console.log('🔥 Error Detail:', data.error)
      }
    }
  }
}
