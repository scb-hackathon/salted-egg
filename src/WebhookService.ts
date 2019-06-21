import * as qs from 'qs'
import axios from 'axios'
import errors from '@feathersjs/errors'

interface ServiceOption {
  query: {[key: string]: string}
}

// Your verify token. Should be a random string.
const {VERIFY_TOKEN, PAGE_ACCESS_TOKEN} = process.env

function validateChallenge(query) {
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('>> Challenge Accepted:', challenge)

      return challenge
    }
  }

  return false
}

async function reply(sender: string, response: any) {
  try {
      // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender
    },
    "message": response
  }

  console.log('>> Sending Response:', response, 'to', sender)

  // Send the HTTP request to the Messenger Platform
  const endpoint = 'https://graph.facebook.com/v2.6/me/messages'

  const {data} = await axios.post(endpoint, request_body, {
    params: {access_token: PAGE_ACCESS_TOKEN}
  })

  console.log('✅ Reply Request is sent!', data)
  } catch (err) {
    console.log('🔥 Reply Error! Response =>', err.response)
  }
}


async function handleMessage(senderID, message) {
  const {attachments, text} = message

  console.log('>> Handling Message')

  if (text) {
    const response = {
      "text": `You sent the message: "${text}". Now send me an attachment!`
    }

    return reply(senderID, response)
  }

  if (attachments) {
    let attachment_url = attachments[0].payload.url;

    const response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }

    return reply(senderID, response)
  }
}

async function handlePostback(senderID, postback) {
  const {payload} = postback

  console.log('>> Handling Postback')

  if (payload === 'yes') {
    return reply(senderID, { "text": "Thanks!" })
  }

  if (payload === 'no') {
    return reply(senderID, { "text": "Oops, try sending another image." })
  }
}

export class WebhookService {
  async find(options: ServiceOption) {
    const {query} = options

    const challenge = validateChallenge(query)
    if (challenge) return challenge

    throw new errors.Forbidden()
  }

  async create(payload) {
    const {object, entry} = payload

    console.log('> CREATE', payload)

    // Checks this is an event from a page subscription
    if (object === 'page') {
      for (let item of entry) {
        const event = item.messaging[0]
        const senderID = event.sender.id

        console.log('Incoming Event! Sender =', senderID)

        if (event.message) handleMessage(senderID, event.message).then()
        if (event.postback) handlePostback(senderID, event.postback).then()
      }

      return 'EVENT_RECEIVED'
    }

    throw new errors.NotFound()
  }
}