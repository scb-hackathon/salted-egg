import errors from '@feathersjs/errors'

import {validateChallenge} from 'messenger/validateChallenge'
import {handleMessage} from 'bot-handlers/handleMessage'
import {handlePostback} from 'bot-handlers/handlePostback'

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

  async create(payload: any) {
    const {object, entry} = payload

    // Checks this is an event from a page subscription
    if (object === 'page') {
      entry.forEach((item: any) => {
        const event = item.messaging[0]
        const senderID = event.sender.id

        if (!event) {
          console.log('🦄 WTF: This should not happen!')
          return
        }

        const {message, postback} = event

        if (message) {
          console.log('> Message:', message.text)

          return handleMessage(senderID, message)
        }

        if (postback) {
          console.log('> Postback =', postback)

          return handlePostback(senderID, postback)
        }

        return
      })

      return 'EVENT_RECEIVED'
    }

    throw new errors.NotFound()
  }
}