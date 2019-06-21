export class DialogflowService {
  async find(options) {
    console.log('GET =', options)

    return {status: 'OK'}
  }

  async create(payload) {
    console.log('POST =', payload)

    return {status: 'OK'}
  }
}