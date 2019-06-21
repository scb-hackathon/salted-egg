import errors from '@feathersjs/errors'
import {validateChallenge} from 'bot/validateChallenge'
import {handleMessage} from 'bot/handleMessage'
import {handlePostback} from 'bot/handlePostback'

export type ServiceQuery = {
  [key: string]: string
}

export interface ServiceOption {
  query: ServiceQuery
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
      entry.forEach(item => {
        const event = item.messaging[0]
        const senderID = event.sender.id

        console.log('Incoming Event! Sender =', senderID)

        if (!event) {
          console.log('🦄 WTF: This should not happen!')
          continue
        }

        const {message, postback} = event

        if (message) {
          console.log('> Message =', message)

          return handleMessage(senderID, message)
        }

        if (postback) {
          console.log('> Postback =', message)

          return handlePostback(senderID, postback)
        }
      })

      return 'EVENT_RECEIVED'
    }

    throw new errors.NotFound()
  }
}