import axios from 'axios'
import errors from '@feathersjs/errors'
import {validateChallenge} from 'validateChallenge'
import {reply} from 'bot/reply'

interface ServiceOption {
  query: {[key: string]: string}
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