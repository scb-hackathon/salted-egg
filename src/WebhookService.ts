import errors from '@feathersjs/errors'

interface ServiceOption {
  query: {[key: string]: string}
}

// Your verify token. Should be a random string.
const {VERIFY_TOKEN} = process.env

console.log('Token =', VERIFY_TOKEN)

export class WebhookService {
  async find(options: ServiceOption) {
    const {query} = options

    // Parse the query params
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    console.log('> FIND', query)

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('>> Challenge Accepted!')

        return challenge
      }
    }

    throw new errors.Forbidden()
  }

  async create(payload) {
    const {object, entry} = payload

    console.log('> CREATE', payload)

    // Checks this is an event from a page subscription
    if (object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      entry.forEach(entry => {
        const event = entry.messaging[0]

        console.log(event)
      })

      return 'EVENT_RECEIVED'
    }

    throw new errors.NotFound()
  }
}