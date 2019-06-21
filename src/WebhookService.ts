import errors from '@feathersjs/errors'

export class WebhookService {
  async find() {
    return {message: 'Tsk Tsk!'}
  }

  async create(payload) {
    const {object, entry} = payload

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